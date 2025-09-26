<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portofolio;

class PortofolioSeeder extends Seeder
{
    public function run()
    {
        $items = [
            ['judul'=>'Juara Lomba A', 'deskripsi'=>'Deskripsi lomba A', 'tahun'=>2021, 'gambar'=>null],
            ['judul'=>'Juara Lomba B', 'deskripsi'=>'Deskripsi lomba B', 'tahun'=>2022, 'gambar'=>null],
            ['judul'=>'Juara Lomba C', 'deskripsi'=>'Deskripsi lomba C', 'tahun'=>2023, 'gambar'=>null],
            ['judul'=>'Juara Lomba D', 'deskripsi'=>'Deskripsi lomba D', 'tahun'=>2022, 'gambar'=>null],
            ['judul'=>'Juara Lomba E', 'deskripsi'=>'Deskripsi lomba E', 'tahun'=>2023, 'gambar'=>null],
        ];

        foreach ($items as $item) {
            Portofolio::create($item);
        }
    }
}
