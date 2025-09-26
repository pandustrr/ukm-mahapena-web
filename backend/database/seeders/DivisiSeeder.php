<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Divisi;

class DivisiSeeder extends Seeder
{
    public function run()
    {
        $divisis = [
            ['periode_id'=>1, 'nama_divisi'=>'IT', 'singkatan_divisi'=>'IT', 'judul_deskripsi'=>'Divisi IT', 'deskripsi'=>'Divisi Teknologi', 'pengertian'=>'Mengelola IT'],
            ['periode_id'=>1, 'nama_divisi'=>'Marketing', 'singkatan_divisi'=>'MKT', 'judul_deskripsi'=>'Divisi Marketing', 'deskripsi'=>'Divisi Promosi', 'pengertian'=>'Mengelola promosi'],
            ['periode_id'=>2, 'nama_divisi'=>'Event', 'singkatan_divisi'=>'EV', 'judul_deskripsi'=>'Divisi Event', 'deskripsi'=>'Divisi Event', 'pengertian'=>'Mengatur acara'],
            ['periode_id'=>2, 'nama_divisi'=>'Content', 'singkatan_divisi'=>'CNT', 'judul_deskripsi'=>'Divisi Konten', 'deskripsi'=>'Divisi Konten', 'pengertian'=>'Membuat konten'],
            ['periode_id'=>3, 'nama_divisi'=>'Design', 'singkatan_divisi'=>'DSN', 'judul_deskripsi'=>'Divisi Design', 'deskripsi'=>'Divisi Design', 'pengertian'=>'Mendesain materi visual'],
        ];

        foreach ($divisis as $divisi) {
            Divisi::create($divisi);
        }
    }
}
