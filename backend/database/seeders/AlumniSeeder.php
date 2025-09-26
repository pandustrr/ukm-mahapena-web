<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alumni;

class AlumniSeeder extends Seeder
{
    public function run()
    {
        $alumnis = [
            ['nama' => 'Budi Santoso', 'prodi' => 'TI', 'angkatan' => 2018, 'jabatan' => 'Staff', 'divisi' => 'IT', 'periode' => '2022/2023', 'foto' => null],
            ['nama' => 'Siti Aminah', 'prodi' => 'SI', 'angkatan' => 2019, 'jabatan' => 'Koordinator', 'divisi' => 'Marketing', 'periode' => '2022/2023', 'foto' => null],
            ['nama' => 'Andi Wijaya', 'prodi' => 'TI', 'angkatan' => 2020, 'jabatan' => 'Staff', 'divisi' => 'Design', 'periode' => '2023/2024', 'foto' => null],
            ['nama' => 'Rina Marlina', 'prodi' => 'SI', 'angkatan' => 2017, 'jabatan' => 'Manager', 'divisi' => 'Event', 'periode' => '2021/2022', 'foto' => null],
            ['nama' => 'Dewi Kurnia', 'prodi' => 'TI', 'angkatan' => 2021, 'jabatan' => 'Staff', 'divisi' => 'Content', 'periode' => '2023/2024', 'foto' => null],
        ];

        foreach ($alumnis as $alumni) {
            Alumni::create($alumni);
        }
    }
}
