<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    protected $locations;

    public function __construct()
    {
        $path = storage_path('app/peru_locations.json');
        $json = file_get_contents($path);
        $this->locations = json_decode($json, true);
    }

    /**
     * Retorna todo el árbol de ubicaciones
     * GET /api/locations
     */
    public function all()
    {
        return response()->json($this->locations);
    }

    /**
     * Lista de todos los departamentos
     * GET /api/locations/departments
     */
    public function departments()
    {
        $departments = collect($this->locations['datos'])->pluck('departamento')->values();

        return response()->json([
            'total' => count($departments),
            'departamentos' => $departments
        ]);
    }

    /**
     * Provincias de un departamento específico
     * GET /api/locations/departments/{department}/provinces
     */
    public function provinces($department)
    {
        $dept = collect($this->locations['datos'])
            ->firstWhere('departamento', $department);

        if (!$dept) {
            return response()->json([
                'message' => 'Departamento no encontrado',
                'departamento' => $department
            ], 404);
        }

        $provinces = collect($dept['provincias'])->pluck('nombre')->values();

        return response()->json([
            'departamento' => $department,
            'total' => count($provinces),
            'provincias' => $provinces
        ]);
    }

    /**
     * Distritos de una provincia específica
     * GET /api/locations/departments/{department}/provinces/{province}/districts
     */
    public function districts($department, $province)
    {
        $dept = collect($this->locations['datos'])
            ->firstWhere('departamento', $department);

        if (!$dept) {
            return response()->json([
                'message' => 'Departamento no encontrado',
                'departamento' => $department
            ], 404);
        }

        $prov = collect($dept['provincias'])
            ->firstWhere('nombre', $province);

        if (!$prov) {
            return response()->json([
                'message' => 'Provincia no encontrada',
                'departamento' => $department,
                'provincia' => $province
            ], 404);
        }

        return response()->json([
            'departamento' => $department,
            'provincia' => $province,
            'total' => count($prov['distritos']),
            'distritos' => $prov['distritos']
        ]);
    }
}
