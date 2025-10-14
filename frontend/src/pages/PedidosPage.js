import React, { useState } from "react";
import PedidosTable from "../components/PedidosTable";
import PedidoForm from "../components/PedidoForm";

const PedidosPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Pedidos</h1>

      {/* Formulario para crear pedido */}
      <PedidoForm onSuccess={() => setRefresh(!refresh)} />

      {/* Tabla de pedidos */}
      <PedidosTable key={refresh} />
    </div>
  );
};

export default PedidosPage;
