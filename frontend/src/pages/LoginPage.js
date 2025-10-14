import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

const LoginPage = ({ onLogin }) => {
  return (
    <div className="container">
      <div className="login_card">
        <h1>Bienvenido a CoffeeManager</h1>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
