<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portofolio;

class PortofolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Portofolio::create([
            'judul' => 'Juara 1 Lomba Web Design Nasional',
            'deskripsi' => 'Tim Mahapena berhasil meraih Juara 1 pada ajang Lomba Web Design tingkat nasional yang diadakan di Surabaya.',
            'tahun' => 2023,
            'gambar' => 'web-design.jpg',
        ]);

        Portofolio::create([
            'judul' => 'Juara 2 Hackathon Mahasiswa Indonesia',
            'deskripsi' => 'Mengembangkan aplikasi inovatif berbasis IoT untuk pertanian cerdas dalam kompetisi Hackathon tingkat mahasiswa.',
            'tahun' => 2022,
            'gambar' => 'hackathon.jpg',
        ]);

        Portofolio::create([
            'judul' => 'Finalis Lomba StartUp Digital',
            'deskripsi' => 'Masuk ke babak final dalam lomba StartUp Digital dengan ide aplikasi marketplace khusus UKM kampus.',
            'tahun' => 2021,
            'gambar' => 'startup.jpg',
        ]);

        Portofolio::create([
            'judul' => 'Juara Favorit Desain Poster Kreatif',
            'deskripsi' => 'Karya poster mahasiswa Mahapena menjadi juara favorit di ajang lomba desain grafis tingkat universitas.',
            'tahun' => 2020,
            'gambar' => 'poster.jpg',
        ]);
    }
}
