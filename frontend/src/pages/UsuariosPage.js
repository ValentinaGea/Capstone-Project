import React, { useEffect, useState } from "react";
import { getUsuarios, crearUsuario } from "../api/api";
import UsuariosTable from "../components/UsuariosTable";
import "../styles/table.css";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ username: "", password: "", rol: "user" });
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      const res = await getUsuarios();
      if (res.data.success) setUsuarios(res.data.data);
      else setError(res.data.message || "Error cargando usuarios");
    } catch (e) {
      setError("Error de conexión con el backend");
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError("");
    if (!nuevo.username || !nuevo.password) { setError("Usuario y contraseña obligatorios"); return; }
    try {
      const res = await crearUsuario({ ...nuevo, requester: "admin" }); // requester si backend lo pide
      if (res.data.success) {
        setNuevo({ username: "", password: "", rol: "user" });
        fetchUsuarios();
      } else {
        setError(res.data.message || "Error al crear usuario");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="usuario-form" onSubmit={handleCrear}>
        <input
          type="text"
          placeholder="Usuario"
          value={nuevo.username}
          onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevo.password}
          onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
        />
        <select value={nuevo.rol} onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crear usuario</button>
      </form>

      <UsuariosTable usuarios={usuarios} onEdit={() => {}} onRefresh={fetchUsuarios} />
    </div>
  );
};

export default UsuariosPage;
