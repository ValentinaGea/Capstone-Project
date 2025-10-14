import React, { useState, useEffect, useRef } from "react";
import ProductosTable from "../components/ProductosTable";
import ProductoForm from "../components/ProductoForm";
import { getProductos } from "../api/api";
import "../styles/productos.css";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [editingProducto, setEditingProducto] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // referencia al formulario
  const formRef = useRef(null);

  useEffect(() => {
    fetchProductos();
  }, [refresh]);

  const fetchProductos = async () => {
    try {
      const response = await getProductos();
      if (response.data.success) {
        setProductos(response.data.data);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  // Editar producto
  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); 
  };

  const handleFormSuccess = () => {
    setEditingProducto(null);
    setRefresh((prev) => !prev);
  };

  const handleFormCancel = () => {
    setEditingProducto(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Productos</h1>

      {/* Formulario con referencia para scroll */}
      <div ref={formRef}>
        <ProductoForm
          key={editingProducto ? editingProducto.id : "nuevo"}
          producto={editingProducto}
          onSuccess={handleFormSuccess}
          onCancel={editingProducto ? handleFormCancel : null}
        />
      </div>

      {/* Tabla de productos */}
      <ProductosTable
        productos={productos}
        onEdit={handleEdit}
        onRefresh={() => setRefresh((prev) => !prev)}
      />
    </div>
  );
};

export default ProductosPage;
