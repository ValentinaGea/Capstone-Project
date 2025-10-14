import React from "react";
import "../styles/navbar.css";

const Navbar = ({ user, onLogout, onToggleSidebar, sidebarVisible }) => {
  if (!user) return null;

  return (
    <div className="navbar">
      <button className="menu-btn" onClick={onToggleSidebar}>
        {sidebarVisible ? "✖" : "☰"}
      </button>
      <div className="navbar-right">
        <span className="user-info">
          👤 {user.username} ({user.rol})
        </span>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
