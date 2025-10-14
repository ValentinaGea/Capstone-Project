import React from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = ({ user, visible, onClose }) => {
  if (!user) return null;

  // Cierra el sidebar automáticamente en móvil
  const maybeClose = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${visible ? "visible" : ""}`}>
      <h2 className="sidebar-title">CoffeeManager</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link" onClick={maybeClose}>
            📊 Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/productos" className="sidebar-link" onClick={maybeClose}>
            📦 Productos
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/pedidos" className="sidebar-link" onClick={maybeClose}>
            📝 Pedidos
          </Link>
        </li>
        {user.rol === "admin" && (
          <li className="sidebar-item">
            <Link to="/usuarios" className="sidebar-link" onClick={maybeClose}>
              👤 Usuarios
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
