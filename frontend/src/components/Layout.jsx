import NavBar from './NavBar'; // Ajusta la ruta a tu NavBar
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main>
        {/* Aquí aparecerá Lobby, Profile, etc., sin recargar el NavBar */}
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;