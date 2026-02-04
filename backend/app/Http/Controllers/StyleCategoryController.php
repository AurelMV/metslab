<?php

namespace App\Http\Controllers;

use App\Models\StyleCategory;
use Illuminate\Http\Request;

class StyleCategoryController extends Controller
{
    /**
     * Display a listing of style categories
     */
    public function index()
    {
        $categories = StyleCategory::orderBy('name')->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Store a newly created category (ADMIN ONLY)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:style_categories,name'],
        ]);

        $category = StyleCategory::create($validated);

        return response()->json([
            'message' => 'Categoría de estilo creada exitosamente',
            'data' => $category,
        ], 201);
    }

    /**
     * Update the specified category (ADMIN ONLY)
     */
    public function update(Request $request, StyleCategory $styleCategory)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:style_categories,name,' . $styleCategory->id],
        ]);

        $styleCategory->update($validated);

        return response()->json([
            'message' => 'Categoría de estilo actualizada exitosamente',
            'data' => $styleCategory,
        ]);
    }

    /**
     * Remove the specified category (ADMIN ONLY)
     */
    public function destroy(StyleCategory $styleCategory)
    {
        // Verificar si hay productos usando esta categoría
        if ($styleCategory->products()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar esta categoría porque tiene productos asociados',
            ], 422);
        }

        $styleCategory->delete();

        return response()->json([
            'message' => 'Categoría de estilo eliminada exitosamente',
        ]);
    }
}
