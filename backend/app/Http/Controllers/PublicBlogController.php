<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class PublicBlogController extends Controller
{
    // Tampilkan semua blog yang statusnya 'published'
    public function index()
    {
        $blogs = Blog::where('status', 'published')->latest()->get();
        return response()->json($blogs);
    }

    // Tampilkan detail blog sesuai id jika statusnya 'published'
    public function show($id)
    {
        $blog = Blog::where('id', $id)
            ->where('status', 'published')
            ->first();

        if (!$blog) {
            return response()->json([
                'message' => 'Blog tidak ditemukan atau belum dipublikasikan'
            ], 404);
        }

        return response()->json([
            'data' => $blog
        ]);
    }
}
