<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo admins pueden crear productos
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'object_category_id' => ['required', 'exists:object_categories,id'],
            'style_category_id' => ['required', 'exists:style_categories,id'],

            // Validar Variaciones (Array anidado)
            'variations' => ['sometimes', 'array', 'min:1'],
            'variations.*.color_id' => ['required', 'exists:colors,id'],
            'variations.*.lenght' => ['required', 'numeric', 'min:0'],
            'variations.*.width' => ['required', 'numeric', 'min:0'],
            'variations.*.height' => ['required', 'numeric', 'min:0'],
            'variations.*.price' => ['required', 'numeric', 'min:0'],
            'variations.*.stock' => ['required', 'integer', 'min:0'],
            'variations.*.status' => ['sometimes', 'string', 'in:active,inactive'],

            // Validar Imágenes (URLs iniciales)
            'images' => ['sometimes', 'array'],
            'images.*.url' => ['required', 'url'],
            'images.*.order' => ['sometimes', 'integer'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del modelo 3D es obligatorio',
            'object_category_id.required' => 'Debes seleccionar una categoría de objeto',
            'object_category_id.exists' => 'La categoría de objeto seleccionada no existe',
            'style_category_id.required' => 'Debes seleccionar una categoría de estilo',
            'style_category_id.exists' => 'La categoría de estilo seleccionada no existe',
        ];
    }
}
