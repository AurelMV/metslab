import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SpaceCard from '../components/SpaceCard';

const PRODUCTS_DATA = [
  { id: 1, name: "Soporte Laptop Ergonómico", price: 85.00, category: "Oficina", material: "PLA+", color: "Naranja", img: "https://images.unsplash.com/photo-1616533751474-0f2c4623f954?q=80&w=500" },
  { id: 2, name: "Lámpara Geométrica Moon", price: 120.00, category: "Hogar", material: "Resina", color: "Blanco", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=500" },
  { id: 3, name: "Organizador de Cables", price: 25.00, category: "Oficina", material: "PLA", color: "Gris", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500" },
  { id: 4, name: "Maceta Autorregable", price: 45.00, category: "Hogar", material: "PETG", color: "Verde", img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=500" },
  // ... más productos
];

function Lobby() {
  const phoneNumber = "51900564785";
  const message = "Hola! Me gustaría obtener más información sobre las impresiones personalizadas.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    { id: 1, img: 'https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?q=80&w=2070', title: 'Resistencia & Precisión', desc: 'Materiales industriales para resultados profesionales.' },
    { id: 2, img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070', title: 'Haz Realidad tus Ideas', desc: 'Desde el diseño digital hasta la pieza física en tus manos.' },
    { id: 3, img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070', title: 'Envíos a todo el Perú', desc: 'Tu pedido seguro, estés donde estés.' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
  };

  return (
    <div className="bg-[#F8F9FA]">
      {/* HERO SECTION / CARRUSEL */}
      <section className="relative w-full h-screen overflow-hidden bg-gray-900">
        <AnimatePresence initial={false} custom={direction} >
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none select-none"
          >
            <img src={slides[currentSlide].img} className="w-full h-full object-cover opacity-50" alt="slide" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
              <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-orange-500 font-bold uppercase tracking-[0.4em] mb-4 text-sm">
                MetsLap 3D Solutions
              </motion.span>
              <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-light mb-6 max-w-4xl">
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light">
                {slides[currentSlide].desc}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 pointer-events-auto cursor-pointer"
              >
                Explorar Ahora
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Paginación (Puntos) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className={`h-1 transition-all duration-500 cursor-pointer ${i === currentSlide ? 'w-12 bg-orange-500' : 'w-6 bg-white/30'}`}
            />
          ))}
        </div>
      </section>


      {/* SECCIÓN DE ESPACIOS */}
      <section className="py-24 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Inspiración</span>
          <h2 className="text-4xl font-light text-gray-900 mt-2">Espacios MetsLab</h2>
        </div>

        {/* Contenedor de Scroll con CSS Inline para la barra estética */}
        <div
          className="max-w-7xl mx-auto flex gap-8 overflow-x-auto pb-8 px-6 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#FB923C transparent', // Naranja suave
          }}
        >
          <style>{`
      /* Estilos para navegadores Chrome/Safari */
      .overflow-x-auto::-webkit-scrollbar {
        height: 4px; /* Barra muy fina */
      }
      .overflow-x-auto::-webkit-scrollbar-track {
        background: transparent;
      }
      .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #FB923C; /* Naranja */
        border-radius: 20px;
      }
    `}</style>

          <SpaceCard
            category="Para tu Escritorio"
            title="Productividad con Estilo"
            img="/escritorio.jpg"
            link="/catalog?category=Oficina"
          />
          <SpaceCard
            category="Para tu Sala"
            title="Decoración para tu Hogar"
            img="/salon.jpg"
            link="/catalog?category=Hogar"
          />
          <SpaceCard
            category="Para tu Cocina"
            title="Organización y Funcionalidad"
            img="/cocina.jpg"
            link="/catalog?category=cocina"
          />
          <SpaceCard
            category="Para tu Jardín"
            title="Macetas con Personalidad"
            img="/macetas.jpg"
            link="/catalog?category=Jardin"
          />
        </div>
      </section>

      {/* SECCIÓN DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Catálogo de Piezas</span>
            <h2 className="text-4xl font-light text-gray-900 mt-2">Productos Destacados</h2>
          </div>
          <Link to="/catalog" className="text-gray-500 hover:text-orange-500 transition-colors font-medium border-b border-gray-200 hover:border-orange-500 pb-1">
            Ver todo el catálogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Usamos tus datos de productos reales filtrados o los primeros 4 */}
          {PRODUCTS_DATA.slice(0, 4).map((product) => (
            <div key={product.id} className="group">
              {/* Envolvemos la caja de imagen en un Link para mayor usabilidad */}
              <Link to={`/product/${product.id}`}>
                <div className="aspect-4/5 bg-[#F3F2EE] rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative mb-6 cursor-pointer">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* El botón "Ver Detalles" ahora es puramente estético/indicativo */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-gray-900 px-6 py-3 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl pointer-events-none">
                    Ver Detalles
                  </div>
                </div>
              </Link>

              <div className="px-2">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                  {product.material || "PLA Premium"}
                </span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-medium text-gray-800 mt-1 hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xl font-bold text-gray-900 mt-2">S/ {product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Columna 1: Branding */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-orange-500">MetsLap</h2>
              <p className="text-gray-400 leading-relaxed">
                Tu tienda favorita para encontrar impresiones de calidad
                y servicios 3D personalizados. <br />
              </p>
            </div>

            {/* Columna 2: Redes Sociales */}
            <div>
              <h3 className="text-lg font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1EtjDXd2mE/" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all transform hover:-translate-y-1">
                  <span className="sr-only">Facebook</span>
                  <i className="fab fa-facebook-f">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook-icon lucide-facebook">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </i>
                </a>
                <a href="https://www.instagram.com/metslab_3d_solution" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all transform hover:-translate-y-1">
                  <span className="sr-only">Instagram</span>
                  <i className="fab fa-instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram-icon lucide-instagram">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </i>
                </a>
              </div>
            </div>

            {/* Columna 3: Contacto / WhatsApp */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto Directo</h3>
              <p className="text-gray-400 mb-4 text-sm">Contactanos por WhatsApp:</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-900/20"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.174l.33.196c1.43.847 3.074 1.294 4.766 1.295h.005c5.732 0 10.395-4.662 10.397-10.397.002-2.777-1.08-5.388-3.046-7.354-1.967-1.966-4.577-3.048-7.352-3.048-5.733 0-10.396 4.663-10.399 10.398-.001 1.832.481 3.62 1.392 5.196l.216.372-1.008 3.682 3.77-.989z" />
                </svg>
                Chat de WhatsApp
              </a>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 MetsLap. Todos los derechos reservados.</p>
          </div>
        </div>

        {/* Botón Flotante de WhatsApp (Opcional) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
          title="Chatea con nosotros"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.207l-.633 2.316 2.369-.621c.903.54 1.847.886 3.007.886 3.18 0 5.765-2.586 5.765-5.766s-2.585-5.788-5.765-5.788z" />
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.174l.33.196c1.43.847 3.074 1.294 4.766 1.295h.005c5.732 0 10.395-4.662 10.397-10.397.002-2.777-1.08-5.388-3.046-7.354-1.967-1.966-4.577-3.048-7.352-3.048-5.733 0-10.396 4.663-10.399 10.398-.001 1.832.481 3.62 1.392 5.196l.216.372-1.008 3.682 3.77-.989z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default Lobby;