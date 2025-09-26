<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;

class BlogSeeder extends Seeder
{
    public function run()
    {
        $blogs = [
            ['title'=>'Tips Produktif', 'slug'=>'tips-produktif', 'content'=>'Konten produktif...', 'excerpt'=>'Tips produktif singkat', 'category_id'=>1, 'status'=>'published'],
            ['title'=>'Belajar Laravel', 'slug'=>'belajar-laravel', 'content'=>'Konten Laravel...', 'excerpt'=>'Intro Laravel', 'category_id'=>2, 'status'=>'draft'],
            ['title'=>'React JS Dasar', 'slug'=>'react-js-dasar', 'content'=>'Konten React...', 'excerpt'=>'React dasar', 'category_id'=>3, 'status'=>'published'],
            ['title'=>'SEO Blog', 'slug'=>'seo-blog', 'content'=>'Konten SEO...', 'excerpt'=>'Tips SEO', 'category_id'=>1, 'status'=>'archived'],
            ['title'=>'UI/UX Design', 'slug'=>'ui-ux-design', 'content'=>'Konten Design...', 'excerpt'=>'Intro UI/UX', 'category_id'=>2, 'status'=>'published'],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
