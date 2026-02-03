<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// --- RUTAS PÚBLICAS (Auth) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// --- RUTAS PROTEGIDAS ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:client')->group(function () {
        // Rutas solo accesibles para clientes
    });

    Route::middleware('role:admin')->group(function () {
        // Rutas solo accesibles para administradores
    });
});
