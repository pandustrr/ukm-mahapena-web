<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            "message" => "Data berhasil disimpan!",
            'data' => $category,
            'code' => 201
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $blog_category)
    {
        return response()->json($blog_category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $blog_category)
    {
        // $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:blog_categories,name,' . $blog_category->id,
        ]);

        $blog_category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json([
            "message" => "Data berhasil disimpan!",
            'data' => $blog_category,
            'code' => 201
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $blog_category)
    {
        // $category = Category::findOrFail($id);
        $blog_category->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
