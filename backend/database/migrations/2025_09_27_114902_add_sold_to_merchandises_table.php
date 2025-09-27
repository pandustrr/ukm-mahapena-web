<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('merchandises', function (Blueprint $table) {
            $table->integer('sold')->default(0)->after('stock'); // kolom baru
        });
    }

    public function down(): void
    {
        Schema::table('merchandises', function (Blueprint $table) {
            $table->dropColumn('sold');
        });
    }
};
