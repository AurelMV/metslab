<?php

namespace App\Http\Controllers;

use App\Models\ObjectCategory;
use Illuminate\Http\Request;

class ObjectCategoryController extends Controller
{
    /**
     * Display a listing of object categories
     */
    public function index()
    {
        $categories = ObjectCategory::orderBy('name')->get();

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
            'name' => ['required', 'string', 'max:255', 'unique:object_categories,name'],
        ]);

        $category = ObjectCategory::create($validated);

        return response()->json([
            'message' => 'Categoría de objeto creada exitosamente',
            'data' => $category,
        ], 201);
    }

    /**
     * Update the specified category (ADMIN ONLY)
     */
    public function update(Request $request, ObjectCategory $objectCategory)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:object_categories,name,' . $objectCategory->id],
        ]);

        $objectCategory->update($validated);

        return response()->json([
            'message' => 'Categoría de objeto actualizada exitosamente',
            'data' => $objectCategory,
        ]);
    }

    /**
     * Remove the specified category (ADMIN ONLY)
     */
    public function destroy(ObjectCategory $objectCategory)
    {
        // Verificar si hay productos usando esta categoría
        if ($objectCategory->products()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar esta categoría porque tiene productos asociados',
            ], 422);
        }

        $objectCategory->delete();

        return response()->json([
            'message' => 'Categoría de objeto eliminada exitosamente',
        ]);
    }
}
