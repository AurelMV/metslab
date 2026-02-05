<?php

namespace App\Http\Requests\Reclamacion;

use App\Models\Reclamacion;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReclamacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autenticación se maneja via middleware
    }

    public function rules(): array
    {
        $user = $this->user();
        
        // Reglas base (cliente puede editar teléfono y detalle)
        $rules = [
            'telefono' => 'sometimes|string|max:20|regex:/^[0-9+\-\s]+$/',
            'detalle'  => 'sometimes|string|min:10|max:2000',
        ];

        // Solo admin puede cambiar el estado
        if ($user->hasRole('admin')) {
            $estados = implode(',', Reclamacion::ESTADOS);
            $rules['estado'] = "sometimes|in:{$estados}";
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'telefono.max'    => 'El teléfono no debe exceder 20 caracteres',
            'telefono.regex'  => 'El teléfono solo puede contener números, espacios, + y -',
            'detalle.min'     => 'El detalle debe tener al menos 10 caracteres',
            'detalle.max'     => 'El detalle no debe exceder 2000 caracteres',
            'estado.in'       => 'El estado debe ser: pendiente, en_proceso, resuelto o rechazado',
        ];
    }
}
