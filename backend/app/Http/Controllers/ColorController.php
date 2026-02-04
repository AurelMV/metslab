<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing of colors
     */
    public function index()
    {
        $colors = Color::orderBy('name')->get();

        return response()->json([
            'data' => $colors,
        ]);
    }

    /**
     * Store a newly created color (ADMIN ONLY)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'hex_value' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $color = Color::create($validated);

        return response()->json([
            'message' => 'Color creado exitosamente',
            'data' => $color,
        ], 201);
    }

    /**
     * Update the specified color (ADMIN ONLY)
     */
    public function update(Request $request, Color $color)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'hex_value' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $color->update($validated);

        return response()->json([
            'message' => 'Color actualizado exitosamente',
            'data' => $color,
        ]);
    }

    /**
     * Remove the specified color (ADMIN ONLY)
     */
    public function destroy(Color $color)
    {
        // Verificar si hay variaciones usando este color
        if ($color->variations()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar este color porque tiene variaciones asociadas',
            ], 422);
        }

        $color->delete();

        return response()->json([
            'message' => 'Color eliminado exitosamente',
        ]);
    }
}
