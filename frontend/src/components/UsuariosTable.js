import React from "react";
import { eliminarUsuario } from "../api/api";
import "../styles/table.css";

const UsuariosTable = ({ usuarios, onEdit, onRefresh }) => {
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    try {
      const response = await eliminarUsuario(id);
      if (response.data.success) onRefresh();
      else alert(response.data.message || "Error al eliminar usuario");
    } catch (err) {
      alert("Error de conexión con el backend");
    }
  };

  if (!usuarios || usuarios.length === 0) {
    return <p>No hay usuarios disponibles.</p>;
  }

  return (
    <div className="table-responsive">
      <h2>Usuarios</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Rol</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td data-label="ID">{u.id}</td>
              <td data-label="Username">{u.username}</td>
              <td data-label="Rol">{u.rol}</td>
              <td data-label="Fecha Creación">{u.fecha_creacion}</td>
              <td data-label="Acciones">
                <button onClick={() => handleEliminar(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;
