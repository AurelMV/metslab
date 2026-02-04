<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Display images for a specific product
     */
    public function index(Product $product)
    {
        $images = $product->images()->orderBy('order')->get();

        return response()->json([
            'data' => $images,
        ]);
    }

    /**
     * Store a newly created image (ADMIN ONLY)
     * Soporta tanto upload de archivos como URLs externas
     */
    public function store(Request $request, Product $product)
    {
        // Validar que venga o un archivo o una URL
        $request->validate([
            'image' => ['required_without:url', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // Max 5MB
            'url' => ['required_without:image', 'url', 'max:500'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $imageUrl = null;

        // Si viene un archivo, subirlo
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // Generar nombre único
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Guardar en storage/app/public/products/{product_id}/
            $path = $file->storeAs(
                'products/' . $product->id,
                $filename,
                'public'
            );
            
            // Generar URL pública
            $imageUrl = Storage::url($path);
        } 
        // Si viene una URL externa, usarla
        else if ($request->has('url')) {
            $imageUrl = $request->url;
        }

        // Si no se proporciona order, usar el siguiente disponible
        $order = $request->order ?? ($product->images()->max('order') + 1 ?? 0);

        $image = $product->images()->create([
            'path' => $imageUrl,
            'order' => $order,
        ]);

        return response()->json([
            'message' => 'Imagen agregada exitosamente',
            'data' => $image,
        ], 201);
    }

    /**
     * Update the specified image (ADMIN ONLY)
     */
    public function update(Request $request, Product $product, ProductImage $productImage)
    {
        // Verificar que la imagen pertenece al producto
        if ($productImage->product_id !== $product->id) {
            return response()->json([
                'message' => 'Imagen no encontrada para este producto',
            ], 404);
        }

        $validated = $request->validate([
            'image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'url' => ['sometimes', 'url', 'max:500'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ]);

        // Si viene un nuevo archivo, eliminar el anterior y subir el nuevo
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si es local
            $this->deleteLocalImage($productImage->path);
            
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products/' . $product->id, $filename, 'public');
            
            $productImage->path = Storage::url($path);
        }
        // Si viene una URL, actualizar
        else if ($request->has('url')) {
            // Eliminar imagen anterior si es local
            $this->deleteLocalImage($productImage->path);
            
            $productImage->path = $request->url;
        }

        // Actualizar order si viene
        if ($request->has('order')) {
            $productImage->order = $request->order;
        }

        $productImage->save();

        return response()->json([
            'message' => 'Imagen actualizada exitosamente',
            'data' => $productImage,
        ]);
    }

    /**
     * Remove the specified image (ADMIN ONLY)
     */
    public function destroy(Product $product, ProductImage $productImage)
    {
        // Verificar que la imagen pertenece al producto
        if ($productImage->product_id !== $product->id) {
            return response()->json([
                'message' => 'Imagen no encontrada para este producto',
            ], 404);
        }

        // Eliminar archivo físico si es local
        $this->deleteLocalImage($productImage->path);

        $productImage->delete();

        return response()->json([
            'message' => 'Imagen eliminada exitosamente',
        ]);
    }

    /**
     * Reorder images for a product (ADMIN ONLY)
     */
    public function reorder(Request $request, Product $product)
    {
        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'exists:product_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['images'] as $imageData) {
            ProductImage::where('id', $imageData['id'])
                ->where('product_id', $product->id)
                ->update(['order' => $imageData['order']]);
        }

        return response()->json([
            'message' => 'Orden de imágenes actualizado exitosamente',
            'data' => $product->images()->orderBy('order')->get(),
        ]);
    }

    /**
     * Helper: Eliminar imagen local del storage
     */
    private function deleteLocalImage(string $path): void
    {
        // Verificar si es una URL local (empieza con /storage/)
        if (str_starts_with($path, '/storage/')) {
            // Convertir URL a path: /storage/products/1/image.jpg -> products/1/image.jpg
            $realPath = str_replace('/storage/', '', $path);
            
            // Eliminar si existe
            if (Storage::disk('public')->exists($realPath)) {
                Storage::disk('public')->delete($realPath);
            }
        }
    }
}
