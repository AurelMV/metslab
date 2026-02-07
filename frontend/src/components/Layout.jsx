import NavBar from './NavBar'; // Ajusta la ruta a tu NavBar
import { Outlet } from 'react-router-dom';

const Layout = ({ onOpenLogin, onOpenRegister, isModalOpen }) => {
  return (
    <>
      <NavBar onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} isModalOpen={isModalOpen} />
      <main>
        {/* Aquí aparecerá Lobby, Profile, etc., sin recargar el NavBar */}
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;