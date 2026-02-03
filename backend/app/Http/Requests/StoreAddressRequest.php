<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autenticación se maneja via middleware
    }

    public function rules(): array
    {
        return [
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'street_name'  => 'required|string|max:255',
            'department'   => 'nullable|string|max:100',
            'province'     => 'required|string|max:100',
            'district'     => 'required|string|max:100',
            'postal_code'  => 'required|string|max:20',
            'phone_number' => 'required|string|max:20',
            'latitude'     => 'nullable|numeric|between:-90,90',
            'longitude'    => 'nullable|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required'   => 'El nombre es obligatorio',
            'last_name.required'    => 'El apellido es obligatorio',
            'street_name.required'  => 'La dirección de calle es obligatoria',
            'province.required'     => 'La provincia es obligatoria',
            'district.required'     => 'El distrito es obligatorio',
            'postal_code.required'  => 'El código postal es obligatorio',
            'phone_number.required' => 'El número de teléfono es obligatorio',
        ];
    }
}
