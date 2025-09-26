<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeder yang dijalankan
        $this->call([
            // Kategori dan Tag Blog
            CategorySeeder::class,
            TagSeeder::class,

            // Blog
            BlogSeeder::class,

            // Portofolio
            PortofolioSeeder::class,

            // Merchandise dan Kategorinya
            CategoryMerchandiseSeeder::class,
            MerchandiseSeeder::class,

            // Pengurus dan Periode
            PeriodeSeeder::class,
            DivisiSeeder::class,
            PengurusSeeder::class,
            AlumniSeeder::class,

            // Program Kerja
            ProkerSeeder::class,

            // Admin
            AdminSeeder::class,
        ]);
    }
}
