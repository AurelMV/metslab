import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import NavBar from '../components/NavBar.jsx';

function Lobby() {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (success) => {
    if (success) {
      setIsOpenLogin(false);
    }
  };

  const handleRegisterSuccess = (success) => {
    if (success) {
      setIsOpenRegister(false);
    }
  };

  return (
    <div >
      <NavBar />
      <div className='p-4'>
        <button
          disabled={isAuthenticated === true}
          
          onClick={() => setIsOpenLogin(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Abrir login
        </button>

        <button
          onClick={() => setIsOpenRegister(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Abrir registro
        </button>

        {/* <button
          onClick={() => window.location.href = '/profile'}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold ml-4"
        >
          Ir a
          Perfil
        </button> */}

        <div>
          {isOpenLogin &&
            <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </Modal>}
        </div>

        <div>
          <Modal isOpen={isOpenRegister} onClose={() => setIsOpenRegister(false)} children={
            <Register onRegisterSuccess={handleRegisterSuccess} />
          }>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Lobby;