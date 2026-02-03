<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\LocationController;


// --- RUTAS PÚBLICAS (Auth) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// --- RUTAS PÚBLICAS (Ubicaciones de Perú) ---
Route::prefix('locations')->group(function () {
    Route::get('/', [LocationController::class, 'all']);
    Route::get('/departments', [LocationController::class, 'departments']);
    Route::get('/departments/{department}/provinces', [LocationController::class, 'provinces']);
    Route::get('/departments/{department}/provinces/{province}/districts', [LocationController::class, 'districts']);
});


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

    Route::apiResource('addresses', AddressController::class);
});
