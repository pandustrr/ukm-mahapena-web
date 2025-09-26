<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run()
    {
        $tags = [
            ['name'=>'Laravel', 'slug'=>'laravel'],
            ['name'=>'React', 'slug'=>'react'],
            ['name'=>'UI/UX', 'slug'=>'ui-ux'],
            ['name'=>'SEO', 'slug'=>'seo'],
            ['name'=>'Tips', 'slug'=>'tips'],
        ];

        foreach ($tags as $t) {
            Tag::create($t);
        }
    }
}
