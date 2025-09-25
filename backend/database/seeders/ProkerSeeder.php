<?php

namespace Database\Seeders;

use App\Models\Proker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProkerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Proker::create([
            'nama' => 'Pelatihan Kepemimpinan',
            'deskripsi' => 'Meningkatkan kemampuan leadership anggota.',
            'tanggal' => '2025-10-01',
            'status' => 'pending',
        ]);

        Proker::create([
            'nama' => 'Bakti Sosial',
            'deskripsi' => 'Kegiatan sosial bersama masyarakat.',
            'tanggal' => '2025-11-15',
            'status' => 'berjalan',
        ]);

        Proker::create([
            'nama' => 'Lomba Karya Tulis Ilmiah',
            'deskripsi' => 'Ajang kompetisi karya tulis ilmiah antar mahasiswa.',
            'tanggal' => '2026-01-10',
            'status' => 'selesai',
        ]);
    }
}
