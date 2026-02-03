<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'   => 'sometimes|string|max:100',
            'last_name'    => 'sometimes|string|max:100',
            'street_name'  => 'sometimes|string|max:255',
            'department'   => 'nullable|string|max:100',
            'province'     => 'sometimes|string|max:100',
            'district'     => 'sometimes|string|max:100',
            'postal_code'  => 'sometimes|string|max:20',
            'phone_number' => 'sometimes|string|max:20',
            'latitude'     => 'nullable|numeric|between:-90,90',
            'longitude'    => 'nullable|numeric|between:-180,180',
        ];
    }
}
