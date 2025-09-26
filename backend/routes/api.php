<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\MerchandiseController;
use App\Http\Controllers\Admin\CategoryMerchandiseController;
use App\Http\Controllers\PublicMerchandiseController;
use App\Http\Controllers\Admin\DivisiController;
use App\Http\Controllers\PublicDivisiController;
use App\Http\Controllers\Admin\PeriodeController;
use App\Http\Controllers\Admin\PengurusController;
use App\Http\Controllers\PublicPeriodeController;
use App\Http\Controllers\PublicPengurusController;
use App\Http\Controllers\Admin\AlumniController;
use App\Http\Controllers\PublicAlumniController;
use App\Http\Controllers\Admin\PortofolioController;
use App\Http\Controllers\PublicPortofolioController;

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProkerController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\PublicBlogController;
use App\Http\Controllers\PublicProkerController;

// =====================
// POST Routes
// =====================
Route::apiResource('posts', PostController::class);

Route::get('public/blogs', [BlogController::class, 'indexPublic']);
Route::get('public/blogs/{slug}', [BlogController::class, 'showPublic']);

// =====================
// User info (sanctum default)
// =====================
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// =====================
// Admin Routes (auth required)
// =====================
Route::prefix('admin')->group(function () {
    // Merchandise CRUD manual
    Route::get('merchandises', [MerchandiseController::class, 'index']);
    Route::post('merchandises', [MerchandiseController::class, 'store']);
    Route::put('merchandises/{id}', [MerchandiseController::class, 'update']);
    Route::delete('merchandises/{id}', [MerchandiseController::class, 'destroy']);
    Route::post('merchandises/{id}/image', [MerchandiseController::class, 'updateImage']);

    // Category Merchandise CRUD manual
    Route::get('categories', [CategoryMerchandiseController::class, 'index']);
    Route::post('categories', [CategoryMerchandiseController::class, 'store']);
    Route::put('categories/{id}', [CategoryMerchandiseController::class, 'update']);
    Route::delete('categories/{id}', [CategoryMerchandiseController::class, 'destroy']);

    // Periode
    Route::get('/periodes', [PeriodeController::class, 'index']);
    Route::post('/periodes', [PeriodeController::class, 'store']);
    Route::put('/periodes/{id}', [PeriodeController::class, 'update']);
    Route::delete('/periodes/{id}', [PeriodeController::class, 'destroy']);
    Route::get('/periodes-with-pengurus', [PeriodeController::class, 'withPengurus']); // ✅ tambahan

    // Divisi
    Route::get('/divisis', [DivisiController::class, 'index']);
    Route::post('/divisis', [DivisiController::class, 'store']);
    Route::put('/divisis/{id}', [DivisiController::class, 'update']);
    Route::delete('/divisis/{id}', [DivisiController::class, 'destroy']);
    Route::get('/divisi/periode/{periodeId}', [DivisiController::class, 'byPeriode']);

    // Pengurus CRUD manual
    Route::get('pengurus', [PengurusController::class, 'index']);
    Route::post('pengurus', [PengurusController::class, 'store']);
    Route::put('pengurus/{id}', [PengurusController::class, 'update']);
    Route::delete('pengurus/{id}', [PengurusController::class, 'destroy']);

    Route::get('alumni', [AlumniController::class, 'index']);
    Route::post('alumni', [AlumniController::class, 'store']);
    Route::get('alumni/{id}', [AlumniController::class, 'show']);
    Route::put('alumni/{id}', [AlumniController::class, 'update']);
    Route::delete('alumni/{id}', [AlumniController::class, 'destroy']);

    Route::apiResource('portofolio', PortofolioController::class);
    Route::apiResource('blogs', BlogController::class);
    Route::apiResource('blog-categories', CategoryController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('proker', ProkerController::class);
});

// =====================
// Admin (login/logout & profile)
// =====================
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [AuthController::class, 'dashboard']);
    Route::put('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/profile', [AuthController::class, 'profile']);
});


// =====================
// Public Merchandise Routes
// =====================
Route::get('/merchandises', [PublicMerchandiseController::class, 'index']);
Route::get('/categories', [PublicMerchandiseController::class, 'categories']);
Route::post('/merchandise/{id}/decrease-stock-public', [App\Http\Controllers\Admin\MerchandiseController::class, 'decreaseStockPublic']);

// =====================
// Public Profil Routes
// =====================
Route::get('/divisi', [PublicDivisiController::class, 'index']);

// =====================
// Public Pengurus Routes
// =====================
Route::get('periodes-with-pengurus-public', [PublicPeriodeController::class, 'all']);
Route::get('divisi/periode/{periodeId}', [PublicDivisiController::class, 'byPeriode']); // divisi by periode
Route::get('pengurus-public', [PublicPengurusController::class, 'index']);

// Public Proker
Route::get('/public/proker', [PublicProkerController::class, 'index']);
Route::get('/public/proker/{id}', [PublicProkerController::class, 'show']);

// Public Blog
Route::get('/blogs', [PublicBlogController::class, 'index']);
Route::get('/blogs/{id}', [PublicBlogController::class, 'show']);

// =====================
// Public Alumni Routes
// =====================
Route::get('alumni', [PublicAlumniController::class, 'index']);
Route::get('alumni/{id}', [PublicAlumniController::class, 'show']);

// =====================
// Public Portofolio Routes
// =====================
Route::get('portofolio', [PublicPortofolioController::class, 'index']);
Route::get('portofolio/{id}', [PublicPortofolioController::class, 'show']);


