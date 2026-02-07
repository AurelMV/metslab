import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Datos de producto de ejemplo (esto vendría de tu backend)
const PRODUCTS_DATA = [
    {
        id: '1',
        name: "Soporte Laptop Ergonómico Pro",
        price: 85.00,
        category: "Oficina",
        description: "Soporte ajustable para laptop, diseñado para mejorar la ergonomía y la ventilación. Compatible con la mayoría de laptops de 13 a 17 pulgadas.",
        images: [
            "https://images.unsplash.com/photo-1616533751474-0f2c4623f954?q=80&w=700",
            "https://images.unsplash.com/photo-1606857630718-f21319c5c2a1?q=80&w=700",
            "https://images.unsplash.com/photo-1549419137-9759d58d924d?q=80&w=700"
        ],
        colors: [
            { name: "Negro", hex: "#000000" },
            { name: "Blanco", hex: "#FFFFFF" },
            { name: "Naranja", hex: "#FB923C" }
        ],
        styles: [
            { name: "Standard", priceModifier: 0 },
            { name: "Ventilado", priceModifier: 10 }
        ],
        stock: 25
    },
    {
        id: '2',
        name: "Lámpara Geométrica 'Moon'",
        price: 120.00,
        category: "Hogar",
        description: "Lámpara de mesa con diseño geométrico inspirado en la luna. Ideal para un ambiente moderno y minimalista.",
        images: [
            "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=700",
            "https://images.unsplash.com/photo-1549419137-9759d58d924d?q=80&w=700"
        ],
        colors: [
            { name: "Blanco Lunar", hex: "#F8F8F8" },
            { name: "Gris Oscuro", hex: "#333333" }
        ],
        styles: [
            { name: "Mate", priceModifier: 0 },
            { name: "Brillante", priceModifier: 5 }
        ],
        stock: 15
    },
    // ... más productos
];

function ProductDetail() {
    const { id } = useParams(); // Obtiene el ID del producto de la URL
    const product = PRODUCTS_DATA.find(p => p.id === id);
    const { addToCart } = useCart();

    const [mainImage, setMainImage] = useState(product ? product.images[0] : '');
    const [selectedColor, setSelectedColor] = useState(product ? product.colors[0] : null);
    const [selectedStyle, setSelectedStyle] = useState(product ? product.styles[0] : null);
    const [quantity, setQuantity] = useState(1);

    // Si el producto no existe, podrías redirigir o mostrar un mensaje
    if (!product) {
        return (
            <div className="pt-32 text-center text-gray-500 min-h-screen">
                <h1 className="text-3xl font-light">Producto no encontrado.</h1>
                <p className="mt-4">Lo sentimos, el producto que buscas no existe o fue retirado.</p>
            </div>
        );
    }

    // Calcula el precio final basado en el estilo seleccionado
    const finalPrice = product.price + (selectedStyle ? selectedStyle.priceModifier : 0);

    const handleAddToCart = () => {
        const productToCart = {
            id: `${product.id}-${selectedColor.name}-${selectedStyle.name}`, // ID único por variante
            productId: product.id, // ID base para referencia
            name: product.name,
            price: finalPrice,
            img: mainImage,
            color: selectedColor.name,
            material: selectedStyle.name, // Usamos 'material' o 'style' según tu CartAside
            quantity: quantity
        };

        addToCart(productToCart);
    };

    const relatedProducts = useMemo(() => {
        return PRODUCTS_DATA.filter(p =>
            p.category === product.category && p.id !== product.id
        ).slice(0, 4); // Mostramos solo 4 para mantener la estética
    }, [product.category, product.id]);

    return (
        <div className="pt-32 pb-20 bg-white min-h-screen lg:pl-60 lg:pr-60 md:pl-40 md:pr-40 sm:pl-6 sm:pr-6">
            <div className="max-w-1400px mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* COLUMNA IZQUIERDA: Imagen principal y miniaturas */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <motion.div
                            key={mainImage} // Cambia la key para forzar la animación
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="aspect-square bg-[#F3F2EE] rounded-2xl overflow-hidden shadow-sm"
                        >
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                        </motion.div>

                        {/* Miniaturas de imágenes */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-orange-500' : 'border-transparent'} transition-all`}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Detalles del producto */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        <h1 className="text-4xl font-light text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">{product.description}</p>

                        {/* Selector de Color */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Color: {selectedColor?.name}</h3>
                            <div className="flex gap-3">
                                {product.colors.map(color => (
                                    <motion.button
                                        key={color.name}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor?.name === color.name ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'} transition-all flex items-center justify-center`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {color.hex === "#FFFFFF" && <span className="w-4 h-4 rounded-full border border-gray-400"></span>} {/* Borde para blanco */}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Selector de Estilo/Variante */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-3">Estilo</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.styles.map(style => (
                                    <motion.button
                                        key={style.name}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedStyle(style)}
                                        className={`px-5 py-2 rounded-full border-2 text-sm font-medium transition-all ${selectedStyle?.name === style.name ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400'}`}
                                    >
                                        {style.name} {style.priceModifier > 0 && `(S/ ${style.priceModifier.toFixed(2)} extra)`}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Cantidad y Precio */}
                        <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-xl flex items-center justify-center hover:bg-gray-300"
                                >-</button>
                                <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-xl flex items-center justify-center hover:bg-gray-300"
                                >+</button>
                            </div>
                            <p className="text-5xl font-extrabold text-gray-900">S/ {finalPrice.toFixed(2)}</p>
                        </div>

                        {/* Botón Añadir al Carrito */}
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "#E67E22" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-orange-500 text-white py-4 rounded-full text-lg font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all"
                            onClick={handleAddToCart} // CAMBIO AQUÍ: Llamamos a nuestra función
                        >
                            Añadir al Carrito
                        </motion.button>

                        {/* Stock y Categoría */}
                        <div className="mt-8 text-sm text-gray-500 flex justify-between">
                            <p>Stock disponible: <span className="font-bold text-gray-700">{product.stock} unidades</span></p>
                            <p>Categoría: <span className="font-bold text-orange-500">{product.category}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <section className="mt-24 pt-16 border-t border-gray-100">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Recomendaciones</span>
                        <h2 className="text-3xl font-light text-gray-900 mt-2">Completa tu espacio</h2>
                    </div>
                    <Link to="/catalog" className="text-sm font-semibold border-b-2 border-orange-500 pb-1 hover:text-orange-600 transition-colors">
                        Ver todo el catálogo
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/product/${item.id}`} onClick={() => window.scrollTo(0, 0)}>
                                    <div className="aspect-square bg-[#F3F2EE] rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <h3 className="text-gray-800 font-medium group-hover:text-orange-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-900 font-bold mt-1">S/ {item.price.toFixed(2)}</p>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        // Si no hay relacionados de la misma categoría, mostramos un mensaje sutil
                        <p className="text-gray-400 italic">Explora más productos en nuestro catálogo principal.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ProductDetail;