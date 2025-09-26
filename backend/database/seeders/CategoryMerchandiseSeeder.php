<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryMerchandise;

class CategoryMerchandiseSeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name'=>'Kaos'],
            ['name'=>'Hoodie'],
            ['name'=>'Topi'],
            ['name'=>'Sticker'],
            ['name'=>'Mug'],
        ];

        foreach ($categories as $cat) {
            CategoryMerchandise::create($cat);
        }
    }
}
