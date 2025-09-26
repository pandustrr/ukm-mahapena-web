<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name'=>'Tips', 'slug'=>'tips'],
            ['name'=>'Tutorial', 'slug'=>'tutorial'],
            ['name'=>'Berita', 'slug'=>'berita'],
            ['name'=>'Event', 'slug'=>'event'],
            ['name'=>'Design', 'slug'=>'design'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
