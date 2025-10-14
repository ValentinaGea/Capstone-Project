import React, { useEffect, useState } from "react";
import {
  getDashboard,
  getVentasDiarias,
  getProductosPopulares,
  getVentasCategoria,
} from "../api/api";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [resumen, setResumen] = useState({});
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  const [ventasCategoria, setVentasCategoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resDashboard = await getDashboard();
        if (resDashboard.data.success) setResumen(resDashboard.data.data);

        const resDiarias = await getVentasDiarias();
        if (resDiarias.data.success) setVentasDiarias(resDiarias.data.data);

        const resPopulares = await getProductosPopulares();
        if (resPopulares.data.success) setProductosPopulares(resPopulares.data.data);

        const resCategoria = await getVentasCategoria();
        if (resCategoria.data.success) setVentasCategoria(resCategoria.data.data);
      } catch (err) {
        console.error("Error al cargar estadísticas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard</h1>

      {/* === Cards resumen === */}
      <div className="dashboard-cards">
        <div className="card">🧾 Productos: {resumen.total_productos}</div>
        <div className="card">📦 Pedidos: {resumen.total_pedidos}</div>
        <div className="card">⏳ Pendientes: {resumen.pedidos_pendientes}</div>
        <div className="card">💶 Ventas Totales: {resumen.ventas_totales} €</div>
        <div className="card">💰 Ventas Hoy: {resumen.ventas_hoy} €</div>
      </div>

      {/* === Gráficos === */}
      <div className="charts-column">
        <div className="chart-card">
          <h2>Ventas Diarias</h2>
          <div className="chart-wrapper">
            <Line
              data={{
                labels: ventasDiarias.map((v) => v.fecha),
                datasets: [
                  {
                    label: "Total Ventas (€)",
                    data: ventasDiarias.map((v) => v.total_ventas),
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 123, 255, 0.3)",
                  },
                  {
                    label: "Pedidos",
                    data: ventasDiarias.map((v) => v.num_pedidos),
                    borderColor: "green",
                    backgroundColor: "rgba(40, 167, 69, 0.3)",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h2>Productos Más Vendidos</h2>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: productosPopulares.map((p) => p.nombre),
                datasets: [
                  {
                    label: "Cantidad Vendida",
                    data: productosPopulares.map((p) => p.total_vendido),
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h2>Ventas por Categoría</h2>
          <div className="chart-wrapper">
            <Pie
              data={{
                labels: ventasCategoria.map((c) => c.categoria),
                datasets: [
                  {
                    label: "Ingresos (€)",
                    data: ventasCategoria.map((c) => c.total_ingresos),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(153, 102, 255, 0.6)",
                    ],
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
