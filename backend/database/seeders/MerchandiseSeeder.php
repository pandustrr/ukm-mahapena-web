<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryMerchandise;
use App\Models\Merchandise;

class MerchandiseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan kategori ada dulu
        $kaos = CategoryMerchandise::firstOrCreate(
            ['name' => 'Kaos'],
            ['name' => 'Kaos']
        );

        $hoodie = CategoryMerchandise::firstOrCreate(
            ['name' => 'Hoodie'],
            ['name' => 'Hoodie']
        );

        $aksesoris = CategoryMerchandise::firstOrCreate(
            ['name' => 'Aksesoris'],
            ['name' => 'Aksesoris']
        );

        // Isi merchandise
        Merchandise::create([
            'category_id' => $kaos->id,
            'name' => 'Kaos Mahapena Hitam',
            'price' => 100000,
            'stock' => 50,
            'description' => 'Kaos eksklusif Mahapena warna hitam dengan desain simpel elegan.',
            'sizes' => ['S', 'M', 'L', 'XL'],
            'colors' => ['Hitam'],
            'image' => 'kaos-hitam.jpg',
        ]);

        Merchandise::create([
            'category_id' => $kaos->id,
            'name' => 'Kaos Mahapena Putih',
            'price' => 95000,
            'stock' => 40,
            'description' => 'Kaos Mahapena warna putih dengan bahan adem dan nyaman dipakai.',
            'sizes' => ['S', 'M', 'L', 'XL'],
            'colors' => ['Putih'],
            'image' => 'kaos-putih.jpg',
        ]);

        Merchandise::create([
            'category_id' => $hoodie->id,
            'name' => 'Hoodie Mahapena',
            'price' => 200000,
            'stock' => 25,
            'description' => 'Hoodie hangat dengan logo Mahapena, cocok dipakai sehari-hari.',
            'sizes' => ['M', 'L', 'XL'],
            'colors' => ['Hitam', 'Abu-abu'],
            'image' => 'hoodie.jpg',
        ]);

        Merchandise::create([
            'category_id' => $aksesoris->id,
            'name' => 'Tumbler Mahapena',
            'price' => 75000,
            'stock' => 100,
            'description' => 'Tumbler eksklusif Mahapena, menjaga minuman tetap hangat/dingin.',
            'sizes' => [],
            'colors' => ['Hitam', 'Biru', 'Merah'],
            'image' => 'tumbler.jpg',
        ]);
    }
}
