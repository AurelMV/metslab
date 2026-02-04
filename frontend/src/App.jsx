import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Login.jsx'
import Lobby from './pages/Lobby.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Rutas que deben ser públicas */}
          <Route path="/" element={<Navigate to="/lobby" replace />} />
          <Route path="*" element={<Navigate to="/lobby" replace />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas que deben ser protegidas*/}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
