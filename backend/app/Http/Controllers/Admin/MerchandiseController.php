<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Merchandise;
use App\Models\CategoryMerchandise;
use App\Models\Admin;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // ✅ Tambahkan ini


class MerchandiseController extends Controller
{
    // ==============================
    // Helper: Cek token manual
    // ==============================
    private function checkToken(Request $request)
    {
        $token = $request->header('Authorization');
        if (!$token || !Admin::where('api_token', str_replace('Bearer ', '', $token))->exists()) {
            return false;
        }
        return true;
    }

    // ==============================
    // List semua merchandise
    // ==============================
    public function index(Request $request)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $merchandises = Merchandise::with('category')->get()->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'price' => $m->price,
                'stock' => $m->stock,
                'sold' => $m->sold,
                'description' => $m->description,
                'sizes' => $m->sizes,
                'colors' => $m->colors,
                'image' => $m->image,
                'category_id' => $m->category_id,
                'category_name' => $m->category ? $m->category->name : null,
            ];
        });

        return response()->json($merchandises);
    }

    // ==============================
    // Tambah merchandise baru
    // ==============================
    public function store(Request $request)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'category_id' => 'required|integer|exists:category_merchandises,id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'description' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $merch = new Merchandise();
        $merch->name = $request->name;
        $merch->category_id = $request->category_id;
        $merch->price = $request->price;
        $merch->stock = $request->stock;
        $merch->sold = 0;
        $merch->description = $request->description ?? '';
        $merch->sizes = $request->sizes ?? [];
        $merch->colors = $request->colors ?? [];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('merchandise', 'public');
            $merch->image = $path;
        }

        $merch->save();

        return response()->json($merch, 201);
    }

    // ==============================
    // Update merchandise + image (jadi satu)
    // ==============================
    public function update(Request $request, $id)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $merch = Merchandise::find($id);
        if (!$merch) {
            return response()->json(['message' => 'Merchandise not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string',
            'category_id' => 'sometimes|integer|exists:category_merchandises,id',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'description' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update data biasa
        if ($request->has('name')) $merch->name = $request->name;
        if ($request->has('category_id')) $merch->category_id = $request->category_id;
        if ($request->has('price')) $merch->price = $request->price;
        if ($request->has('stock')) $merch->stock = $request->stock;
        if ($request->has('description')) $merch->description = $request->description;

        // Update sizes & colors, tetap ditimpa walau kosong
        $merch->sizes = $request->input('sizes', []);
        $merch->colors = $request->input('colors', []);

        // Update image jika ada file
        if ($request->hasFile('image')) {
            if ($merch->image && Storage::disk('public')->exists($merch->image)) {
                Storage::disk('public')->delete($merch->image);
            }

            $path = $request->file('image')->store('merchandise', 'public');
            $merch->image = $path;
        }

        $merch->save();
        $merch->refresh();

        return response()->json([
            'message' => 'Merchandise updated successfully',
            'data' => $merch
        ]);
    }

    // ==============================
    // Hapus merchandise
    // ==============================
    public function destroy(Request $request, $id)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $merch = Merchandise::find($id);
        if (!$merch) return response()->json(['message' => 'Not Found'], 404);

        if ($merch->image && Storage::disk('public')->exists($merch->image)) {
            Storage::disk('public')->delete($merch->image);
        }

        $merch->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function decreaseStockPublic(Request $request, $id)
    {
        $merch = Merchandise::find($id);
        if (!$merch) {
            return response()->json(['message' => 'Merchandise not found'], 404);
        }

        $jumlah = $request->input('jumlah', 1);

        if ($merch->stock < $jumlah) {
            return response()->json(['message' => 'Stok tidak cukup'], 400);
        }

        $merch->stock -= $jumlah;
        $merch->sold += $jumlah; // ✅ tambah ke sold
        $merch->save();

        return response()->json([
            'message' => 'Stok berhasil diperbarui',
            'stock' => $merch->stock
        ]);
    }

public function totalSales(Request $request)
{
    if (!$this->checkToken($request)) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $totalSold = Merchandise::sum('sold');
    $totalRevenue = Merchandise::sum(DB::raw('sold * price'));

    return response()->json([
        'totalSold' => $totalSold,
        'totalRevenue' => $totalRevenue,
    ]);
}


}
