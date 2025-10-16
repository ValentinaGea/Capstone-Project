import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductosPage from "./pages/ProductosPage";
import PedidosPage from "./pages/PedidosPage";
import UsuariosPage from "./pages/UsuariosPage";

import "./styles/layout.css";
import "./styles/login.css";

function AppContent() {
  const location = useLocation();
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario"))
  );
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarVisible(true);
      else setSidebarVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    setSidebarVisible(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!usuario) return <Navigate to="/login" />;
    return children;
  };

  // Detectar si estamos en la página de login
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`app-layout ${isLoginPage ? "login-layout" : ""}`}>
      {/* Sidebar solo si NO estamos en login */}
      {!isLoginPage && (
        <Sidebar
          user={usuario}
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />
      )}

      {/* Overlay solo en móvil cuando sidebar está abierto */}
      {sidebarVisible && window.innerWidth <= 768 && !isLoginPage && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      <div className={`main-section ${isLoginPage ? "login-background" : ""}`}>
        {/* Navbar solo si NO estamos en login */}
        {!isLoginPage && (
          <Navbar
            user={usuario}
            onLogout={handleLogout}
            onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
            sidebarVisible={sidebarVisible}
          />
        )}

        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <ProductosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <PedidosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  {usuario?.rol === "admin" ? (
                    <UsuariosPage />
                  ) : (
                    <Navigate to="/dashboard" />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <Navigate to={usuario ? "/dashboard" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
