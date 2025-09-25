<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryMerchandise;

class CategoryMerchandiseSeeder extends Seeder
{
    public function run(): void
    {
        CategoryMerchandise::create(['name' => 'Kaos']);
        CategoryMerchandise::create(['name' => 'Hoodie']);
        CategoryMerchandise::create(['name' => 'Aksesoris']);
    }
}

