import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "../styles/layout.css";

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate(); // Hook para redirección
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      const response = await loginUser(username, password);
      if (response.data.success) {
        const user = response.data.user;
        // Guardar usuario en localStorage y actualizar estado global
        localStorage.setItem("usuario", JSON.stringify(user));
        onLogin(user);
        // Redirigir al dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Credenciales inválidas");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error de conexión al backend");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginForm;
