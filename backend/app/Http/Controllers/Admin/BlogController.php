<?php

namespace App\Http\Controllers\Admin;

use App\Models\Blog;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class BlogController extends Controller
{
    // Cek token admin
    private function checkToken(Request $request)
    {
        $token = $request->header('Authorization');
        if (!$token || !Admin::where('api_token', str_replace('Bearer ', '', $token))->exists()) {
            return false;
        }
        return true;
    }

    // List blogs
    public function index(Request $request)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        try {
            $query = Blog::with('category');

            // Search
            if ($request->filled('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                      ->orWhere('content', 'like', '%' . $request->search . '%');
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Ordering
            $orderBy = $request->get('order_by', 'created_at');
            $orderDirection = $request->get('order_direction', 'desc');
            $query->orderBy($orderBy, $orderDirection);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $blogs = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $blogs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blogs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Store blog
    public function store(Request $request)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'category_id' => 'required|exists:blog_categories,id',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published,archived',
            'featured_image' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        try {
            // Upload image
            if ($request->hasFile('featured_image')) {
                $path = $request->file('featured_image')->store('blog-images', 'public');
                $validated['featured_image'] = $path;
            }

            // Slug unik
            $slug = Str::slug($validated['title']);
            if (Blog::where('slug', $slug)->exists()) {
                $slug .= '-' . time();
            }
            $validated['slug'] = $slug;

            $blog = Blog::create($validated);

            // Tags
            if ($request->has('tags')) {
                $blog->tags()->sync(is_array($request->tags) ? $request->tags : [$request->tags]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Blog created successfully',
                'data' => $blog->load('category', 'tags'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create blog',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Show single blog
    public function show(Request $request, $id)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        try {
            $blog = Blog::with('category', 'tags')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $blog
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blog',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update blog
    public function update(Request $request, $id)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string|max:500',
            'category_id' => 'sometimes|required|exists:blog_categories,id',
            'tags' => 'nullable|array',
            'status' => 'sometimes|required|in:draft,published,archived',
            'featured_image' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        try {
            if ($request->hasFile('featured_image')) {
                if ($blog->featured_image) {
                    Storage::disk('public')->delete($blog->featured_image);
                }
                $path = $request->file('featured_image')->store('blog-images', 'public');
                $validated['featured_image'] = $path;
            }

            if ($request->has('title') && $request->title !== $blog->title) {
                $slug = Str::slug($request->title);
                if (Blog::where('slug', $slug)->where('id', '!=', $blog->id)->exists()) {
                    $slug .= '-' . time();
                }
                $validated['slug'] = $slug;
            }

            $blog->update($validated);

            if ($request->has('tags')) {
                $blog->tags()->sync(is_array($request->tags) ? $request->tags : [$request->tags]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Blog updated successfully',
                'data' => $blog->load('category', 'tags')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update blog',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete blog
    public function destroy(Request $request, $id)
    {
        if (!$this->checkToken($request)) {
            return response()->json(['message'=>'Unauthorized'], 401);
        }

        $blog = Blog::findOrFail($id);

        try {
            if ($blog->featured_image) {
                Storage::disk('public')->delete($blog->featured_image);
            }
            $blog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Blog deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete blog',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
