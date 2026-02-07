import { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartAside = ({ isOpenLogin, setIsOpenLogin }) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // BLOQUEAR SCROLL
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Si no está logueado, cerramos el carrito y abrimos el modal de login
      setIsCartOpen(false);
      setIsOpenLogin(true); 
    } else {
      // Si está logueado, vamos al checkout
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-80"
          />

          {/* SIDEBAR */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-90 flex flex-col"
          >
            {/* HEADER */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold uppercase tracking-tighter text-gray-900">Tu Carrito</h2>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium">No hay productos en el carrito</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/catalog'); }}
                    className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group animate-fadeIn">
                    <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.material}</p>
                      <div className="flex justify-between items-center mt-3">
                         <span className="font-bold text-gray-900">S/ {item.price.toFixed(2)}</span>
                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">x{item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors self-start p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Total estimado</span>
                <span className="text-2xl font-black text-gray-900">S/ {cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl
                  ${cart.length > 0 
                    ? 'bg-gray-900 text-white hover:bg-orange-600 shadow-gray-900/10 active:scale-[0.98]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {isAuthenticated ? 'Finalizar Compra' : 'Inicia Sesión para Pagar'}
              </button>
              
              
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartAside;