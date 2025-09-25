<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json((Tag::all()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name',
        ]);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json([
            "message" => "Data berhasil disimpan!",
            'data' => $tag,
            'code' => 201
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Tag::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tag = Tag::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name',
        ]);

        $request->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json($tag);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tag = Tag::fineOrFail($id);

        $tag->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
