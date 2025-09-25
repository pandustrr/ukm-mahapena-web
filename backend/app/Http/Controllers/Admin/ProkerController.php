<?php

namespace App\Http\Controllers\Admin;

use App\Models\Proker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Admin;

class ProkerController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // Cek token admin
    private function checkToken(Request $request)
    {
        $token = $request->header('Authorization');
        if (!$token || !Admin::where('api_token', str_replace('Bearer ', '', $token))->exists()) {
            return false;
        }
        return true;
    }

    public function index(Request $request)
    {

        return response()->json(Proker::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'nullable|date',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'in:pending,berjalan,selesai',
        ]);

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('proker-images', 'public');
            $validated['featured_image'] = $path;
        }

        $proker = Proker::create($validated);

        return response()->json([
            'message' => 'Proker berhasil ditambah',
            'data' => $proker,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Proker $proker)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        return response()->json($proker);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proker $proker)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'nullable|date',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'in:pending,berjalan,selesai',
        ]);

        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($proker->featured_image) {
                Storage::disk('public')->delete($proker->featured_image);
            }

            $path = $request->file('featured_image')->store('proker-images', 'public');
            $validated['featured_image'] = $path;
        }

        $proker->update($validated);

        return response()->json([
            'message' => 'Proker berhasil diperbarui',
            'data' => $proker,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        // $proker->delete();
        // return response()->json(null, 204);\
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        try {
            $proker = Proker::findOrFail($id);
            if ($proker->featured_image) {
                Storage::disk('public')->delete($proker->featured_image);
            }
            $proker->delete();

            return response()->json([
                'message' => 'Proker berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus proker',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
