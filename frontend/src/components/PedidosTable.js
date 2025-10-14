import React, { useState, useEffect } from "react";
import { getPedidos, actualizarEstadoPedido } from "../api/api";
import "../styles/table.css";

const PedidosTable = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await getPedidos();
      if (response.data.success) setPedidos(response.data.data);
      else setError(response.data.message || "Error al cargar pedidos");
    } catch (err) {
      setError("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      const response = await actualizarEstadoPedido(pedidoId, nuevoEstado);
      if (response.data.success) fetchPedidos();
      else alert(response.data.message || "Error al actualizar estado");
    } catch (err) {
      alert("Error de conexión con el backend");
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="table-responsive">
      <h2>Pedidos</h2>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total (€)</th>
            <th>Fecha</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td data-label="ID">{p.id}</td>
              <td data-label="Cliente">{p.cliente_nombre}</td>
              <td data-label="Estado">{p.estado}</td>
              <td data-label="Total">{p.total}€</td>
              <td data-label="Fecha">{new Date(p.fecha_creacion).toLocaleString()}</td>
              <td data-label="Detalles">
                <ul className="detalle-list">
                  {p.detalles.map((d) => (
                    <li key={d.id}>
                      {d.producto_nombre} (x{d.cantidad}) - {d.subtotal}€
                    </li>
                  ))}
                </ul>
              </td>
              <td data-label="Acciones">
                <select
                  value={p.estado}
                  onChange={(e) => handleEstadoChange(p.id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En_Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosTable;
