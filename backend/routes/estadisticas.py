# backend/routes/estadisticas.py
from flask import Blueprint, jsonify
from db import get_db_connection

estadisticas_bp = Blueprint("estadisticas", __name__, url_prefix="/api/estadisticas")

# ================= VENTAS DIARIAS =================
@estadisticas_bp.route("/ventas-diarias", methods=["GET"])
def get_ventas_diarias():
    """Obtener datos de ventas diarias de los últimos 7 días"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT
                DATE(fecha_creacion) as fecha,
                COUNT(*) as num_pedidos,
                SUM(total) as total_ventas
            FROM pedidos
            WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
              AND estado = 'Completado'
            GROUP BY DATE(fecha_creacion)
            ORDER BY fecha
        """)
        ventas_diarias = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": ventas_diarias})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= PRODUCTOS POPULARES =================
@estadisticas_bp.route("/productos-populares", methods=["GET"])
def get_productos_populares():
    """Obtener productos más vendidos"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT 
                pr.nombre,
                pr.categoria,
                SUM(pd.cantidad) as total_vendido,
                SUM(pd.subtotal) as ingresos_generados
            FROM productos pr
            JOIN pedido_detalles pd ON pr.id = pd.producto_id
            JOIN pedidos p ON pd.pedido_id = p.id
            WHERE p.estado = 'Completado'
            GROUP BY pr.id, pr.nombre, pr.categoria
            ORDER BY total_vendido DESC
            LIMIT 10
        """)
        productos_populares = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": productos_populares})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= VENTAS POR CATEGORÍA =================
@estadisticas_bp.route("/ventas-categoria", methods=["GET"])
def get_ventas_categoria():
    """Obtener ventas por categoría de productos"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT 
                pr.categoria,
                COUNT(pd.id) as productos_vendidos,
                SUM(pd.subtotal) as total_ingresos
            FROM productos pr
            JOIN pedido_detalles pd ON pr.id = pd.producto_id
            JOIN pedidos p ON pd.pedido_id = p.id
            WHERE p.estado = 'Completado'
            GROUP BY pr.categoria
            ORDER BY total_ingresos DESC
        """)
        ventas_categoria = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": ventas_categoria})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= RESUMEN GENERAL =================
@estadisticas_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """Obtener resumen general para el dashboard"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT 
                (SELECT COUNT(*) FROM productos) as total_productos,
                (SELECT COUNT(*) FROM pedidos) as total_pedidos,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'Pendiente') as pedidos_pendientes,
                (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE estado = 'Completado') as ventas_totales,
                (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE DATE(fecha_creacion) = CURDATE() AND estado = 'Completado') as ventas_hoy
        """)
        resumen = cur.fetchone()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": resumen})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
