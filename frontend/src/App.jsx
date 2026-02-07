import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Modal from './components/Modal';
import Lobby from './pages/Lobby';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileInfo from './components/profile/ProfileInfo';
import EditProfile from './components/profile/EditProfile';
import AddressSettings from './components/profile/AddressSettings';
import PaymentMethods from './components/profile/PaymentMethods';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import CartAside from './components/CartAside';
// Otras importaciones de páginas admin si es necesario
// import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <CartAside isOpenLogin={isOpenLogin} setIsOpenLogin={setIsOpenLogin} />
        <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
          <Login onLoginSuccess={() => setIsOpenLogin(false)} />
        </Modal>
        <Modal isOpen={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
          <Register onRegisterSuccess={() => setIsOpenRegister(false)} />
        </Modal>
        <Routes>
          {/* RUTA PADRE CON LAYOUT (Navbar siempre presente) */}
          <Route path="/" element={<Layout onOpenLogin={() => setIsOpenLogin(true)} onOpenRegister={() => setIsOpenRegister(true)} />}>

            {/* --- Rutas Públicas --- */}
            <Route index element={<Navigate to="/lobby" replace />} />
            <Route path="lobby" element={<Lobby />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="product/:id" element={<ProductDetail />} />

            {/* --- Rutas Protegidas (Solo Usuarios Logueados) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />}>
                {/* Estas sub-rutas se renderizarán en el Outlet de Profile */}
                <Route index element={<ProfileInfo />} />
                <Route path="address" element={<AddressSettings />} />
                <Route path="payments" element={<PaymentMethods />} />
                <Route path="edit" element={<EditProfile />} />
              </Route>
            </Route>

            {/* --- Rutas EXCLUSIVAS para Admin --- */}
            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              {/* <Route path="admin/usuarios" element={<AdminUsers />} /> */}
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/lobby" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;