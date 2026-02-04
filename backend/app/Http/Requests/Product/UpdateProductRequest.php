<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo admins pueden actualizar productos
        return $this->user() && $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'object_category_id' => ['sometimes', 'required', 'exists:object_categories,id'],
            'style_category_id' => ['sometimes', 'required', 'exists:style_categories,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del modelo 3D es obligatorio',
            'object_category_id.exists' => 'La categoría de objeto seleccionada no existe',
            'style_category_id.exists' => 'La categoría de estilo seleccionada no existe',
        ];
    }
}
