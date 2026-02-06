import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Modal from './Modal';
import { Link } from 'react-router-dom';

function NavBar() {
  const { isAuthenticated, logout, userRole } = useContext(AuthContext);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="shadow-lg p-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold lg:ml-10 md:ml-5 sm:mr-2 text-orange-400 hover:text-orange-600">
          MetsLap
        </Link>

        <div className="flex items-center gap-4 lg:mr-20 md:mr-5 sm:mr-2">
          {/* Si NO está autenticado, muestra el dropdown de registro/login */}
          {!isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md border border-gray-300 px-4 py-2  text-sm font-medium hover:bg-gray-50 mr-20"
              >
                Registrate
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => { setIsOpenLogin(true); setIsMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => { setIsOpenRegister(true); setIsMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100"
                    >
                      Crear Cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Si está autenticado, muestra botón de Logout y Perfil */
            <div className='relative'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium mr-20 hover:bg-gray-50"
              >
                Menú
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className='py-1'>
                    <div className="py-1">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Perfil
                      </Link>
                    </div>
                    <div>
                      {isAuthenticated && userRole === 'admin' && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                          Panel Admin
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>

                  </div>
                </div>

              )}
            </div>
          )}
          <div>
            <svg
              className="w-6 h-6 text-orange-400 hover:text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
        <Login onLoginSuccess={() => setIsOpenLogin(false)} />
      </Modal>

      <Modal isOpen={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
        <Register onRegisterSuccess={() => setIsOpenRegister(false)} />
      </Modal>
    </nav>
  );
}

export default NavBar;