<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Variation;
use Illuminate\Http\Request;

class VariationController extends Controller
{
    /**
     * Display variations for a specific product
     */
    public function index(Product $product)
    {
        $variations = $product->variations()->with('color')->get();

        return response()->json([
            'data' => $variations,
        ]);
    }

    /**
     * Store a newly created variation (ADMIN ONLY)
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'color_id' => ['required', 'exists:colors,id'],
            'lenght' => ['required', 'numeric', 'min:0'],
            'width' => ['required', 'numeric', 'min:0'],
            'height' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ]);

        $variation = $product->variations()->create($validated);

        return response()->json([
            'message' => 'Variación creada exitosamente',
            'data' => $variation->load('color'),
        ], 201);
    }

    /**
     * Display the specified variation
     */
    public function show(Product $product, Variation $variation)
    {
        // Verificar que la variación pertenece al producto
        if ($variation->product_id !== $product->id) {
            return response()->json([
                'message' => 'Variación no encontrada para este producto',
            ], 404);
        }

        return response()->json([
            'data' => $variation->load('color'),
        ]);
    }

    /**
     * Update the specified variation (ADMIN ONLY)
     */
    public function update(Request $request, Product $product, Variation $variation)
    {
        // Verificar que la variación pertenece al producto
        if ($variation->product_id !== $product->id) {
            return response()->json([
                'message' => 'Variación no encontrada para este producto',
            ], 404);
        }

        $validated = $request->validate([
            'color_id' => ['sometimes', 'required', 'exists:colors,id'],
            'lenght' => ['sometimes', 'required', 'numeric', 'min:0'],
            'width' => ['sometimes', 'required', 'numeric', 'min:0'],
            'height' => ['sometimes', 'required', 'numeric', 'min:0'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ]);

        $variation->update($validated);

        return response()->json([
            'message' => 'Variación actualizada exitosamente',
            'data' => $variation->load('color'),
        ]);
    }

    /**
     * Remove the specified variation (ADMIN ONLY)
     */
    public function destroy(Product $product, Variation $variation)
    {
        // Verificar que la variación pertenece al producto
        if ($variation->product_id !== $product->id) {
            return response()->json([
                'message' => 'Variación no encontrada para este producto',
            ], 404);
        }

        // Verificar si hay órdenes con esta variación
        if ($variation->orderDetails()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar esta variación porque tiene órdenes asociadas',
            ], 422);
        }

        $variation->delete();

        return response()->json([
            'message' => 'Variación eliminada exitosamente',
        ]);
    }
}
