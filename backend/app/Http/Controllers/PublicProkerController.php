<?php

namespace App\Http\Controllers;

use App\Models\Proker;
use Illuminate\Http\Request;

class PublicProkerController extends Controller
{
    public function index()
    {
        try {
            $prokers = Proker::orderBy('tanggal', 'desc')->get();
            return response()->json($prokers);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching proker',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $proker = Proker::findOrFail($id);
            return response()->json($proker);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching proker',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
