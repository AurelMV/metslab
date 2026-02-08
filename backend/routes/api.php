<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VariationController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ObjectCategoryController;
use App\Http\Controllers\StyleCategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ReclamacionController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CatalogController;



// --- RUTAS PÚBLICAS (Auth) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// --- RUTAS PÚBLICAS (Catálogo) ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Categorías y colores (públicas para filtros)
Route::get('/object-categories', [ObjectCategoryController::class, 'index']);
Route::get('/style-categories', [StyleCategoryController::class, 'index']);
Route::get('/colors', [ColorController::class, 'index']);
// --- RUTAS PÚBLICAS (Ubicaciones de Perú) ---
Route::prefix('locations')->group(function () {
    Route::get('/', [LocationController::class, 'all']);
    Route::get('/departments', [LocationController::class, 'departments']);
    Route::get('/departments/{department}/provinces', [LocationController::class, 'provinces']);
    Route::get('/departments/{department}/provinces/{province}/districts', [LocationController::class, 'districts']);
});

// --- RUTAS PÚBLICAS (Catálogo Avanzado) ---
Route::prefix('catalog')->group(function () {
    Route::get('/filters', [CatalogController::class, 'getFilters']);
    Route::get('/products', [CatalogController::class, 'getProducts']);
    Route::get('/products/{product}', [CatalogController::class, 'getProduct']);
    Route::get('/by-color/{color}', [CatalogController::class, 'getProductsByColor']);
    Route::get('/by-category/{objectCategory}', [CatalogController::class, 'getProductsByCategory']);
    Route::get('/featured', [CatalogController::class, 'getFeatured']);
    Route::get('/search', [CatalogController::class, 'search']);
});

// --- RUTAS PROTEGIDAS ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // --- RUTAS DE CLIENTE ---
    Route::middleware('role:client')->group(function () {
        // Aquí irán las rutas del carrito, órdenes, etc.
    });

    // --- RUTAS DE ADMINISTRADOR ---
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        
        // Productos (Admin)
        Route::get('/products', [ProductController::class, 'adminIndex']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Variaciones de productos (Nested Resource)
        Route::get('/products/{product}/variations', [VariationController::class, 'index']);
        Route::post('/products/{product}/variations', [VariationController::class, 'store']);
        Route::get('/products/{product}/variations/{variation}', [VariationController::class, 'show']);
        Route::put('/products/{product}/variations/{variation}', [VariationController::class, 'update']);
        Route::delete('/products/{product}/variations/{variation}', [VariationController::class, 'destroy']);

        // Imágenes de productos (Nested Resource)
        Route::get('/products/{product}/images', [ProductImageController::class, 'index']);
        Route::post('/products/{product}/images', [ProductImageController::class, 'store']);
        Route::put('/products/{product}/images/{productImage}', [ProductImageController::class, 'update']);
        Route::delete('/products/{product}/images/{productImage}', [ProductImageController::class, 'destroy']);
        Route::post('/products/{product}/images/reorder', [ProductImageController::class, 'reorder']);

        // Categorías de Objetos
        Route::post('/object-categories', [ObjectCategoryController::class, 'store']);
        Route::put('/object-categories/{objectCategory}', [ObjectCategoryController::class, 'update']);
        Route::delete('/object-categories/{objectCategory}', [ObjectCategoryController::class, 'destroy']);

        // Categorías de Estilos
        Route::post('/style-categories', [StyleCategoryController::class, 'store']);
        Route::put('/style-categories/{styleCategory}', [StyleCategoryController::class, 'update']);
        Route::delete('/style-categories/{styleCategory}', [StyleCategoryController::class, 'destroy']);

        // Colores
        Route::post('/colors', [ColorController::class, 'store']);
        Route::put('/colors/{color}', [ColorController::class, 'update']);
        Route::delete('/colors/{color}', [ColorController::class, 'destroy']);

        // Gestión de Usuarios
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{userId}', [AdminUserController::class, 'show']);
        
        // Acción directa (Evita problemas de binding)
        Route::post('/users/assign-role', [AdminUserController::class, 'assignRole']);
        
        Route::post('/users/{userId}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    });

    Route::apiResource('addresses', AddressController::class);
    Route::apiResource('reclamaciones', ReclamacionController::class);

});
