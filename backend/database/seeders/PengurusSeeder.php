<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengurus;

class PengurusSeeder extends Seeder
{
    public function run()
    {
        $pengurus = [
            ['divisi_id'=>1, 'periode_id'=>1, 'nama'=>'Budi', 'jabatan'=>'Ketua', 'prodi'=>'TI', 'angkatan'=>2018, 'foto'=>null],
            ['divisi_id'=>2, 'periode_id'=>1, 'nama'=>'Siti', 'jabatan'=>'Staff', 'prodi'=>'SI', 'angkatan'=>2019, 'foto'=>null],
            ['divisi_id'=>3, 'periode_id'=>2, 'nama'=>'Andi', 'jabatan'=>'Koordinator', 'prodi'=>'TI', 'angkatan'=>2020, 'foto'=>null],
            ['divisi_id'=>4, 'periode_id'=>2, 'nama'=>'Rina', 'jabatan'=>'Manager', 'prodi'=>'SI', 'angkatan'=>2017, 'foto'=>null],
            ['divisi_id'=>5, 'periode_id'=>3, 'nama'=>'Dewi', 'jabatan'=>'Staff', 'prodi'=>'TI', 'angkatan'=>2021, 'foto'=>null],
        ];

        foreach ($pengurus as $p) {
            Pengurus::create($p);
        }
    }
}
