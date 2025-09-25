<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $author = User::first() ?? User::factory()->create();
        $category = Category::first() ?? Category::factory()->create();
        $tags = Tag::pluck('id')->take(3)->toArray();

        $blog = Blog::create([
            'title' => 'Hello World in Laravel',
            'slug' => Str::slug('Hello World in Laravel') . '-' . time(),
            'content' => 'Ini adalah konten blog pertama menggunakan Laravel.',
            'excerpt' => 'Belajar Laravel dasar',
            'category_id' => $category->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        if (!empty($tags)) {
            $blog->tags()->sync($tags);
        }
    }
}
