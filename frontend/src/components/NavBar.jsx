import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const MINI_PRODUCTS = [
  { id: 1, name: "Soporte Laptop Ergonómico", category: "Oficina", img: "https://images.unsplash.com/photo-1616533751474-0f2c4623f954?q=80&w=100" },
  { id: 2, name: "Lámpara Geométrica Moon", category: "Hogar", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=100" },
  { id: 3, name: "Organizador de Cables", category: "Oficina", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=100" },
];

function NavBar({ onOpenLogin, onOpenRegister }) {
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/lobby";
  const [isTransparent, setIsTransparent] = useState(isHomePage);
  const [openMenu, setOpenMenu] = useState(null);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { setIsCartOpen, cart } = useCart();

  // useEffect para manejar la búsqueda en tiempo real
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = MINI_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Mostramos solo los 5 mejores resultados
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setShowResults(false);
      navigate(`/catalogo?search=${searchQuery}`);
    }
  };

  // useEffect para resetear la transparencia si cambias de página
  useEffect(() => {
    if (!isHomePage) {
      setIsTransparent(false);
    } else {
      // Si regresas al home, vuelve a verificar el scroll
      setIsTransparent(window.scrollY < 50);
    }
  }, [location.pathname, isHomePage]);

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };


  useMotionValueEvent(scrollY, "change", (latest) => {
    // agregar un else si se quiere hacer dinamica la tranparencia del navbar, por ahora solo se hace transparente 
    // en el home (en el setisTransparent cambiar a latest < 50 para hacerlo dinamico 
    // (el 50 son los pixeles que se deben scrollear para que el navbar deje de ser transparente))
    if (isHomePage) {
      setIsTransparent(true);
    }

    if (latest > 500) {
      setHidden(true);
      setOpenMenu(null);
    } else {
      setHidden(false);
    }
  });

  const navRef = useRef(null);

  // useEffect para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <motion.nav
      ref={navRef}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-500 ${isTransparent
        ? "bg-transparent shadow-none"
        : "bg-white/90 backdrop-blur-md shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-1 group">
          <span className="text-orange-500">M</span>
          <span className={isTransparent ? "text-white" : "text-gray-900"}>etsLap</span>
        </Link>

        {/* BUSCADOR MINIMALISTA */}
        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Buscar piezas 3D..."
            value={searchQuery}
            onKeyDown={handleSearchSubmit}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded-full px-5 py-2 w-64 text-sm transition-all outline-none border ${isTransparent
              ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:w-80"
              : "bg-gray-100 border-transparent focus:bg-white focus:border-orange-500 focus:w-80"
              }`}


          />

          {/* Menú de Resultados de Autocompletado */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-60"
              >
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => { setShowResults(false); setSearchQuery(""); }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 transition-colors group"
                      >
                        <img src={product.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={() => { navigate(`/catalog?search=${searchQuery}`); setShowResults(false); }}
                      className="w-full py-3 bg-gray-50 text-orange-500 text-xs font-bold uppercase tracking-tighter hover:bg-orange-100 transition-colors"
                    >
                      Ver todos los resultados
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No hay coincidencias exactas...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NAVEGACIÓN DERECHA */}
        <div className={`flex items-center gap-8 text-sm font-semibold tracking-wide uppercase ${isTransparent ? "text-white" : "text-gray-800"
          }`}>

          <div className='relative'>
            <button className='hover:text-orange-500 transition-colors'>
              <Link to="/catalog">
                Catálogo
              </Link>
            </button>
          </div>

          <div className='relative'>
            <button onClick={() => toggleMenu('spaces')} className="hover:text-orange-500 transition-colors">
              Espacios
            </button>
            {openMenu === 'spaces' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-4 w-48 rounded-xl shadow-xl bg-white p-2 border border-gray-100">
                <Link
                  to="/catalog?category=Oficina"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Escritorio
                </Link>
                <Link
                  to="/catalog?category=Hogar"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Sala
                </Link>
                <Link
                  to="/catalog?category=Cocina"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Cocina
                </Link>
                <Link
                  to="/catalog?category=Jardin"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-lg"
                >
                  Jardín
                </Link>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => toggleMenu('user')} className={`px-5 py-2 rounded-full border transition-all ${isTransparent
              ? "border-white/30 hover:bg-white hover:text-orange-500"
              : "border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}>
              {isAuthenticated ? "Cuenta" : "Entrar"}
            </button>
            {openMenu === 'user' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-4 w-56 rounded-xl shadow-xl bg-white p-2 border border-gray-100 text-gray-800 normal-case">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { onOpenLogin && onOpenLogin(); setOpenMenu(null); }}
                      className="block w-full text-left px-4 py-3 hover:bg-orange-50 rounded-lg font-bold text-orange-500">
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => { onOpenRegister && onOpenRegister(); setOpenMenu(null); }}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
                      Crear Cuenta
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50 rounded-lg">Mi Perfil</Link>
                    {userRole === 'admin' && <Link to="/admin/dashboard" className="block px-4 py-3 hover:bg-orange-50 text-orange-600 rounded-lg font-bold">Panel Admin</Link>}
                    <button onClick={() => { logout(); setOpenMenu(null); }} className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg">Cerrar Sesión</button>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Carrito */}
          <button onClick={() => setIsCartOpen(true)} className="relative">
            <div className="cursor-pointer hover:text-orange-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Modales ahora se renderizan en App.jsx para aparecer sobre toda la app */}
    </motion.nav>
  );
}

export default NavBar;