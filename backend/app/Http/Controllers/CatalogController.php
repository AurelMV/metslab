<?php

namespace App\Http\Controllers;

use App\Http\Resources\CatalogProductResource;
use App\Models\Color;
use App\Models\ObjectCategory;
use App\Models\Product;
use App\Models\StyleCategory;
use App\Models\Variation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatalogController extends Controller
{
    /**
     * Get all available filters for the catalog.
     * Returns categories, colors, styles, and price ranges with product counts.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilters()
    {
        // Object Categories with product count
        $objectCategories = ObjectCategory::withCount('products')
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'product_count' => $cat->products_count,
            ]);

        // Style Categories with product count
        $styleCategories = StyleCategory::withCount('products')
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'product_count' => $cat->products_count,
            ]);

        // Colors with product count (through variations)
        $colors = Color::select('colors.*')
            ->join('variations', 'colors.id', '=', 'variations.color_id')
            ->join('products', 'variations.product_id', '=', 'products.id')
            ->groupBy('colors.id')
            ->selectRaw('COUNT(DISTINCT products.id) as product_count')
            ->orderBy('colors.name')
            ->get()
            ->map(fn($color) => [
                'id' => $color->id,
                'name' => $color->name,
                'hex_value' => $color->hex_value,
                'product_count' => $color->product_count,
            ]);

        // Price range from variations
        $priceRange = Variation::selectRaw('MIN(price) as min_price, MAX(price) as max_price')->first();

        return response()->json([
            'object_categories' => $objectCategories,
            'style_categories' => $styleCategories,
            'colors' => $colors,
            'price_range' => [
                'min' => (float) ($priceRange->min_price ?? 0),
                'max' => (float) ($priceRange->max_price ?? 0),
            ],
        ]);
    }

    /**
     * Get paginated products with multiple combinable filters.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getProducts(Request $request)
    {
        $query = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color']);

        // Filter by object category
        if ($request->filled('object_category_id')) {
            $query->where('object_category_id', $request->object_category_id);
        }

        // Filter by style category
        if ($request->filled('style_category_id')) {
            $query->where('style_category_id', $request->style_category_id);
        }

        // Filter by color (through variations)
        if ($request->filled('color_id')) {
            $query->whereHas('variations', function ($q) use ($request) {
                $q->where('color_id', $request->color_id);
            });
        }

        // Filter by price range (through variations)
        if ($request->filled('min_price')) {
            $query->whereHas('variations', function ($q) use ($request) {
                $q->where('price', '>=', $request->min_price);
            });
        }

        if ($request->filled('max_price')) {
            $query->whereHas('variations', function ($q) use ($request) {
                $q->where('price', '<=', $request->max_price);
            });
        }

        // Filter only products in stock
        if ($request->boolean('in_stock')) {
            $query->whereHas('variations', function ($q) {
                $q->where('stock', '>', 0);
            });
        }

        // Search by name or description
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'newest');
        $query = $this->applySorting($query, $sortBy);

        // Pagination
        $perPage = min((int) $request->get('per_page', 12), 50); // Max 50 items
        $products = $query->paginate($perPage);

        return CatalogProductResource::collection($products)->additional([
            'applied_filters' => [
                'object_category_id' => $request->object_category_id,
                'style_category_id' => $request->style_category_id,
                'color_id' => $request->color_id,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'in_stock' => $request->boolean('in_stock'),
                'search' => $request->search,
                'sort_by' => $sortBy,
            ],
        ]);
    }

    /**
     * Get a single product with full details.
     *
     * @param Product $product
     * @return CatalogProductResource
     */
    public function getProduct(Product $product)
    {
        $product->load(['objectCategory', 'styleCategory', 'images', 'variations.color']);

        return new CatalogProductResource($product, true);
    }

    /**
     * Get products filtered by color.
     *
     * @param Color $color
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getProductsByColor(Color $color, Request $request)
    {
        $perPage = min((int) $request->get('per_page', 12), 50);

        $products = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color'])
            ->whereHas('variations', function ($q) use ($color) {
                $q->where('color_id', $color->id);
            })
            ->latest()
            ->paginate($perPage);

        return CatalogProductResource::collection($products)->additional([
            'filter' => [
                'color' => [
                    'id' => $color->id,
                    'name' => $color->name,
                    'hex_value' => $color->hex_value,
                ],
            ],
        ]);
    }

    /**
     * Get products filtered by object category.
     *
     * @param ObjectCategory $objectCategory
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getProductsByCategory(ObjectCategory $objectCategory, Request $request)
    {
        $perPage = min((int) $request->get('per_page', 12), 50);

        $products = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color'])
            ->where('object_category_id', $objectCategory->id)
            ->latest()
            ->paginate($perPage);

        return CatalogProductResource::collection($products)->additional([
            'filter' => [
                'category' => [
                    'id' => $objectCategory->id,
                    'name' => $objectCategory->name,
                ],
            ],
        ]);
    }

    /**
     * Get featured products for the homepage.
     * Returns newest products with available stock.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function getFeatured(Request $request)
    {
        $limit = min((int) $request->get('limit', 8), 20);

        $products = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color'])
            ->whereHas('variations', function ($q) {
                $q->where('stock', '>', 0);
            })
            ->latest()
            ->limit($limit)
            ->get();

        return CatalogProductResource::collection($products);
    }

    /**
     * Search products by name or description.
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
        ]);

        $searchTerm = $request->q;
        $perPage = min((int) $request->get('per_page', 12), 50);

        $products = Product::with(['objectCategory', 'styleCategory', 'images', 'variations.color'])
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('description', 'like', "%{$searchTerm}%");
            })
            ->latest()
            ->paginate($perPage);

        return CatalogProductResource::collection($products)->additional([
            'search_query' => $searchTerm,
            'results_count' => $products->total(),
        ]);
    }

    /**
     * Apply sorting to the query based on sort_by parameter.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $sortBy
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function applySorting($query, string $sortBy)
    {
        switch ($sortBy) {
            case 'price_asc':
                return $query->addSelect([
                    'min_variation_price' => Variation::select('price')
                        ->whereColumn('product_id', 'products.id')
                        ->orderBy('price')
                        ->limit(1)
                ])->orderBy('min_variation_price', 'asc');

            case 'price_desc':
                return $query->addSelect([
                    'min_variation_price' => Variation::select('price')
                        ->whereColumn('product_id', 'products.id')
                        ->orderBy('price')
                        ->limit(1)
                ])->orderBy('min_variation_price', 'desc');

            case 'name':
                return $query->orderBy('name', 'asc');

            case 'name_desc':
                return $query->orderBy('name', 'desc');

            case 'oldest':
                return $query->oldest();

            case 'newest':
            default:
                return $query->latest();
        }
    }
}
