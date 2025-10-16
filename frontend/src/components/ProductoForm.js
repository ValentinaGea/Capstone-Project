import React, { useState, useEffect } from "react";
import { crearProducto, actualizarProducto } from "../api/api";

const ProductoForm = ({ producto, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [stock, setStock] = useState(0);
  const [error, setError] = useState("");

  // Cuando se selecciona un producto, cargamos sus datos
  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio);
      setCategoria(producto.categoria || "General");
      setStock(producto.stock || 0);
    } else {
      limpiarFormulario();
    }
  }, [producto]);

  // Función para limpiar todos los campos
  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("General");
    setStock(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !precio) {
      setError("Nombre y precio son obligatorios");
      return;
    }

    const data = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      stock: parseInt(stock),
    };

    try {
      let response;
      if (producto) {
        response = await actualizarProducto(producto.id, data);
      } else {
        response = await crearProducto(data);
      }

      if (response.data.success) {
        onSuccess();
        limpiarFormulario(); // limpiamos el form al guardar
      } else {
        setError(response.data.message || "Error al guardar producto");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
    if (onCancel) onCancel();
  };

  return (
    <div className="producto-form" >
      <h3>{producto ? "Editar Producto" : "Nuevo Producto"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Descripción:</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <button type="submit">{producto ? "Actualizar" : "Crear"}</button>{" "}
        {onCancel && <button type="button" onClick={handleCancel}>Cancelar</button>}
      </form>
    </div>
  );
};

export default ProductoForm;
