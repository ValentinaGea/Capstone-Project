import React, { useState, useEffect } from "react";
import { getProductos, crearPedido } from "../api/api";
import "../styles/pedidos.css";

const PedidoForm = ({ onSuccess }) => {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [error, setError] = useState("");
  const [productoActual, setProductoActual] = useState("");

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await getProductos();
        if (response.data.success) {
          setProductosDisponibles(response.data.data);
        }
      } catch (err) {
        setError("Error al cargar productos");
      }
    };
    fetchProductos();
  }, []);

  // Agregar un producto al pedido
  const handleAgregarProducto = () => {
    const productoId = productoActual;
    if (!productoId) return;

    const producto = productosDisponibles.find((p) => p.id === parseInt(productoId));
    if (producto && !productosSeleccionados.find((p) => p.producto_id === producto.id)) {
      setProductosSeleccionados([
        ...productosSeleccionados,
        { producto_id: producto.id, nombre: producto.nombre, cantidad: 1 },
      ]);
      setProductoActual(""); // <-- Limpiar la selección después de agregar
    }
  };

  // Cambiar cantidad
  const handleCantidadChange = (id, cantidad) => {
    setProductosSeleccionados(
      productosSeleccionados.map((p) =>
        p.producto_id === id ? { ...p, cantidad: parseInt(cantidad) } : p
      )
    );
  };

  // Eliminar producto de la lista
  const handleEliminar = (id) => {
    setProductosSeleccionados(productosSeleccionados.filter((p) => p.producto_id !== id));
  };

  // Enviar pedido al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (productosSeleccionados.length === 0) {
      setError("Debes seleccionar al menos un producto");
      return;
    }

    const pedidoData = {
      cliente_nombre: clienteNombre || "Cliente",
      productos: productosSeleccionados.map((p) => ({
        producto_id: p.producto_id,
        cantidad: p.cantidad,
      })),
    };

    try {
      const response = await crearPedido(pedidoData);
      if (response.data.success) {
        alert("Pedido creado exitosamente ✅");
        setClienteNombre("");
        setProductosSeleccionados([]);
        setProductoActual(""); // <-- Limpiar el select después de crear pedido
        if (onSuccess) onSuccess();
      } else {
        setError(response.data.message || "Error al crear pedido");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    }
  };

  return (
    <div className="pedido-form">
      <h3>Crear nuevo pedido</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del cliente:</label>
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
        </div>

        <div>
          <label>Agregar producto:</label>
          <select
            value={productoActual}
            onChange={(e) => setProductoActual(e.target.value)}
          >
            <option value="">-- Selecciona un producto --</option>
            {productosDisponibles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.precio} €)
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAgregarProducto}>
            ➕ Agregar
          </button>
        </div>

        <h4>Productos seleccionados:</h4>
        {productosSeleccionados.length === 0 && <p>No hay productos en el pedido</p>}
        <ul>
          {productosSeleccionados.map((p) => (
            <li key={p.producto_id}>
              {p.nombre} - Cantidad:{" "}
              <input
                type="number"
                value={p.cantidad}
                min="1"
                onChange={(e) => handleCantidadChange(p.producto_id, e.target.value)}
              />
              <button type="button" onClick={() => handleEliminar(p.producto_id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>

        <button type="submit">Crear Pedido</button>
      </form>
    </div>
  );
};

export default PedidoForm;
