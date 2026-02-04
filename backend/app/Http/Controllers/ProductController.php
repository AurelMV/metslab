<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of products (PUBLIC - para clientes)
     */
    public function index(Request $request)
    {
        $query = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color']);

        // Filtros opcionales
        if ($request->has('object_category_id')) {
            $query->where('object_category_id', $request->object_category_id);
        }

        if ($request->has('style_category_id')) {
            $query->where('style_category_id', $request->style_category_id);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }

    // ...

    /**
     * Store a newly created product (ADMIN ONLY)
     * Soporta creación anidada de variaciones e imágenes
     */
    public function store(StoreProductRequest $request)
    {
        return DB::transaction(function () use ($request) {
            // 1. Crear Producto
            $product = Product::create($request->validated());

            // 2. Crear Variaciones (si existen)
            if ($request->has('variations')) {
                foreach ($request->variations as $variation) {
                    $product->variations()->create($variation);
                }
            }

            // 3. Crear Imágenes (si existen)
            if ($request->has('images')) {
                foreach ($request->images as $index => $imageData) {
                    $product->images()->create([
                        'path' => $imageData['url'],
                        'order' => $imageData['order'] ?? $index,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Modelo 3D completo creado exitosamente',
                'product' => new ProductResource($product->load(['objectCategory', 'styleCategory', 'images', 'variations.color'])),
            ], 201);
        });
    }

    /**
     * Display the specified product (PUBLIC)
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load(['objectCategory', 'styleCategory', 'images', 'variations.color']));
    }

    /**
     * Update the specified product (ADMIN ONLY)
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return response()->json([
            'message' => 'Modelo 3D actualizado exitosamente',
            'product' => new ProductResource($product->load(['objectCategory', 'styleCategory', 'images', 'variations.color'])),
        ]);
    }

    /**
     * Remove the specified product (ADMIN ONLY)
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Modelo 3D eliminado exitosamente',
        ]);
    }

    /**
     * Get all products for admin panel with full details
     */
    public function adminIndex(Request $request)
    {
        $query = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color']);

        // Filtros de búsqueda
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('object_category_id')) {
            $query->where('object_category_id', $request->object_category_id);
        }

        if ($request->has('style_category_id')) {
            $query->where('style_category_id', $request->style_category_id);
        }

        $products = $query->latest()->paginate($request->get('per_page', 20));

        return ProductResource::collection($products);
    }
}
