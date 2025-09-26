<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Periode;

class PeriodeSeeder extends Seeder
{
    public function run()
    {
        $periodes = [
            ['nama_periode'=>'2021/2022'],
            ['nama_periode'=>'2022/2023'],
            ['nama_periode'=>'2023/2024'],
            ['nama_periode'=>'2024/2025'],
            ['nama_periode'=>'2025/2026'],
        ];

        foreach ($periodes as $p) {
            Periode::create($p);
        }
    }
}
