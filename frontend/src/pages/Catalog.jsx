import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';

// Datos de ejemplo (Esto vendría de tu API de Laravel)
const PRODUCTS_DATA = [
    { id: 1, name: "Soporte Laptop Ergonómico", price: 85.00, category: "Oficina", material: "PLA+", color: "Naranja", img: "https://images.unsplash.com/photo-1616533751474-0f2c4623f954?q=80&w=500" },
    { id: 2, name: "Lámpara Geométrica Moon", price: 120.00, category: "Hogar", material: "Resina", color: "Blanco", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=500" },
    { id: 3, name: "Organizador de Cables", price: 25.00, category: "Oficina", material: "PLA", color: "Gris", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500" },
    { id: 4, name: "Maceta Autorregable", price: 45.00, category: "Hogar", material: "PETG", color: "Verde", img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=500" },
    // ... más productos
];

function Catalog() {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || "";
    const queryFromUrl = searchParams.get('search') || "";
    const categoryFromUrl = searchParams.get('category') || "Todos";

    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [priceRange, setPriceRange] = useState(500);

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
        setSelectedCategory(searchParams.get('category') || "Todos");
    }, [searchParams]);

    // Sincronizar el estado de búsqueda con la URL
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    // Filtros dinámicos
    const filteredProducts = useMemo(() => {
        return PRODUCTS_DATA.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
            const matchesPrice = product.price <= priceRange;
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [searchQuery, selectedCategory, priceRange]);

    return (
        <div className="pt-28 pb-20 bg-white min-h-screen">
            <div className="max-w-400 mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* SIDEBAR DE FILTROS */}
                    <aside className="w-full md:w-72 shrink-0">
                        <div className="sticky top-32">
                            <h2 className="text-2xl font-light mb-8 text-gray-900 tracking-tight">Filtros</h2>

                            {/* Búsqueda en tiempo real */}
                            <div className="mb-10">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3 block">Buscar</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nombre del producto..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                    />
                                    <svg className="w-4 h-4 absolute right-4 top-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>

                            {/* Categorías */}
                            <div className="mb-10">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 block">Categorías</label>
                                <div className="space-y-2">
                                    {["Todos", "Oficina", "Hogar", "cocina", "Jardin"].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rango de Precio */}
                            <div className="mb-10">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 block">Precio Máximo: S/ {priceRange}</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>

                            {/* Otros Filtros (Materiales) */}
                            {/* <div className="mb-10">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 block">Material</label>
                                <div className="flex flex-wrap gap-2">
                                    {["PLA", "PLA+", "Resina", "PETG"].map(m => (
                                        <span key={m} className="px-3 py-1 border border-gray-200 text-[11px] rounded-full hover:border-orange-500 cursor-pointer transition-colors">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </aside>

                    {/* GRID DE PRODUCTOS (4 Columnas) */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-10">
                            <p className="text-gray-500 text-sm">{filteredProducts.length} productos encontrados</p>
                            
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group"
                                    >
                                        <Link to={`/product/${product.id}`}> {/* AÑADE ESTO */}
                                            <div className="aspect-4/5 bg-[#F3F2EE] rounded-2xl overflow-hidden mb-4">
                                                <img
                                                    src={product.img}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    alt={product.name}
                                                />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                            <p className="text-orange-600 font-bold">S/ {product.price.toFixed(2)}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-40">
                                <p className="text-gray-400 text-lg">No encontramos productos que coincidan con tu búsqueda.</p>
                                <button onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }} className="text-orange-500 mt-4 font-bold border-b border-orange-500">Limpiar filtros</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Catalog;