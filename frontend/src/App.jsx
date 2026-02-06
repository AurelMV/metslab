import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileInfo from './components/profile/ProfileInfo';
import EditProfile from './components/profile/EditProfile';
import AddressSettings from './components/profile/AddressSettings';
import PaymentMethods from './components/profile/PaymentMethods';
// Otras importaciones de páginas admin si es necesario
// import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PADRE CON LAYOUT (Navbar siempre presente) */}
        <Route path="/" element={<Layout />}>

          {/* --- Rutas Públicas --- */}
          <Route index element={<Navigate to="/lobby" replace />} />
          <Route path="lobby" element={<Lobby />} />

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
  );
}

export default App;