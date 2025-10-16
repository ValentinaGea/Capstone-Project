import axios from "axios";

// Solo la URL base del backend (sin /api)
const API_URL = process.env.REACT_APP_API_URL;

// Auth
export const loginUser = (username, password) =>
  axios.post(`${API_URL}/api/auth/login`, { username, password });

// Productos
export const getProductos = () => axios.get(`${API_URL}/api/productos/`);
export const crearProducto = (producto) => axios.post(`${API_URL}/api/productos/`, producto);
export const actualizarProducto = (id, producto) => axios.put(`${API_URL}/api/productos/${id}`, producto);
export const eliminarProducto = (id) => axios.delete(`${API_URL}/api/productos/${id}`);

// Usuarios
export const getUsuarios = () => axios.get(`${API_URL}/api/auth/usuarios`);
export const crearUsuario = (usuario) => axios.post(`${API_URL}/api/auth/usuarios`, usuario);
export const eliminarUsuario = (id) => axios.delete(`${API_URL}/api/auth/usuarios/${id}?requester=admin`);

// Pedidos
export const getPedidos = () => axios.get(`${API_URL}/api/pedidos/`);
export const crearPedido = (pedido) => axios.post(`${API_URL}/api/pedidos/`, pedido);
export const actualizarEstadoPedido = (id, estado) => axios.put(`${API_URL}/api/pedidos/${id}/estado`, { estado });

// Estadísticas
export const getVentasDiarias = () => axios.get(`${API_URL}/api/estadisticas/ventas-diarias`);
export const getProductosPopulares = () => axios.get(`${API_URL}/api/estadisticas/productos-populares`);
export const getVentasCategoria = () => axios.get(`${API_URL}/api/estadisticas/ventas-categoria`);
export const getDashboardResumen = () => axios.get(`${API_URL}/api/estadisticas/dashboard`);
export const getDashboard = getDashboardResumen;
