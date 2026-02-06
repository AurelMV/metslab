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
      
    </div>
  );
}

export default Lobby;