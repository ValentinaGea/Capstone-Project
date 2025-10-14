import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://coffee-manager-6ghx.onrender.com/api";


const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// ---------------------- AUTENTICACIÓN ----------------------
export const loginUser = (username, password) =>
  api.post("/auth/login", { username, password });

// ---------------------- PRODUCTOS ----------------------
export const getProductos = () => api.get("/productos/");
export const crearProducto = (producto) => api.post("/productos/", producto);
export const actualizarProducto = (id, producto) =>
  api.put(`/productos/${id}`, producto);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

// ---------------------- USUARIOS ----------------------
export const getUsuarios = () => api.get("/auth/usuarios");
export const crearUsuario = (usuario) => api.post("/auth/usuarios", usuario);
export const eliminarUsuario = (id) =>
  api.delete(`/auth/usuarios/${id}?requester=admin`);

// ---------------------- PEDIDOS ----------------------
export const getPedidos = () => api.get("/pedidos/");
export const crearPedido = (pedido) => api.post("/pedidos/", pedido);
export const actualizarEstadoPedido = (id, estado) =>
  api.put(`/pedidos/${id}/estado`, { estado });

// ---------------------- ESTADÍSTICAS ----------------------
export const getVentasDiarias = () => api.get("/estadisticas/ventas-diarias");
export const getProductosPopulares = () =>
  api.get("/estadisticas/productos-populares");
export const getVentasCategoria = () =>
  api.get("/estadisticas/ventas-categoria");
export const getDashboardResumen = () => api.get("/estadisticas/dashboard");
export const getDashboard = getDashboardResumen;
