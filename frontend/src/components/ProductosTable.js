import React from "react";
import { eliminarProducto } from "../api/api";
import "../styles/table.css";

const ProductosTable = ({ productos, onEdit, onRefresh }) => {
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este producto?")) return;
    try {
      const response = await eliminarProducto(id);
      if (response.data.success) onRefresh();
      else alert(response.data.message || "Error al eliminar producto");
    } catch (err) {
      alert("Error de conexión con el backend");
    }
  };

  if (!productos || productos.length === 0) return <p>No hay productos disponibles.</p>;

  return (
    <div className="table-responsive">
      <h2>Productos</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td data-label="ID">{p.id}</td>
              <td data-label="Nombre">{p.nombre}</td>
              <td data-label="Descripción">{p.descripcion}</td>
              <td data-label="Precio">{p.precio}</td>
              <td data-label="Categoría">{p.categoria}</td>
              <td data-label="Stock">{p.stock}</td>
              <td data-label="Acciones">
                <button onClick={() => onEdit(p)}>Editar</button>{" "}
                <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosTable;
