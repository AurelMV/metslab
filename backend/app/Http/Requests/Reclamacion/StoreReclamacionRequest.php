<?php

namespace App\Http\Requests\Reclamacion;

use Illuminate\Foundation\Http\FormRequest;

class StoreReclamacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autenticación se maneja via middleware
    }

    public function rules(): array
    {
        return [
            'order_id' => 'required|integer|exists:orders,id',
            'telefono' => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',
            'detalle'  => 'required|string|min:10|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required'   => 'El pedido es obligatorio',
            'order_id.exists'     => 'El pedido especificado no existe',
            'telefono.required'   => 'El teléfono de contacto es obligatorio',
            'telefono.max'        => 'El teléfono no debe exceder 20 caracteres',
            'telefono.regex'      => 'El teléfono solo puede contener números, espacios, + y -',
            'detalle.required'    => 'El detalle de la reclamación es obligatorio',
            'detalle.min'         => 'El detalle debe tener al menos 10 caracteres',
            'detalle.max'         => 'El detalle no debe exceder 2000 caracteres',
        ];
    }
}
