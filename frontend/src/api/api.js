import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api";

export const loginUser = async (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

// Productos
export const getProductos = () => axios.get(`${API_URL}/productos/`);
export const crearProducto = (producto) => axios.post(`${API_URL}/productos/`, producto);
export const actualizarProducto = (id, producto) => axios.put(`${API_URL}/productos/${id}`, producto);
export const eliminarProducto = (id) => axios.delete(`${API_URL}/productos/${id}`);

// Usuarios
export const getUsuarios = () => axios.get(`${API_URL}/auth/usuarios`);
export const crearUsuario = (usuario) => axios.post(`${API_URL}/auth/usuarios`, usuario);
export const eliminarUsuario = (id) => axios.delete(`${API_URL}/auth/usuarios/${id}?requester=admin`);

// Pedidos
export const getPedidos = () => axios.get(`${API_URL}/pedidos/`);
export const crearPedido = (pedido) => axios.post(`${API_URL}/pedidos/`, pedido);
export const actualizarEstadoPedido = (id, estado) => axios.put(`${API_URL}/pedidos/${id}/estado`, { estado });

// Estadísticas
export const getVentasDiarias = () => axios.get(`${API_URL}/estadisticas/ventas-diarias`);
export const getProductosPopulares = () => axios.get(`${API_URL}/estadisticas/productos-populares`);
export const getVentasCategoria = () => axios.get(`${API_URL}/estadisticas/ventas-categoria`);
export const getDashboardResumen = () => axios.get(`${API_URL}/estadisticas/dashboard`);
export const getDashboard = getDashboardResumen;
