# backend/routes/estadisticas.py
from flask import Blueprint, jsonify
from db import get_db_connection
import psycopg2.extras

estadisticas_bp = Blueprint("estadisticas", __name__, url_prefix="/api/estadisticas")

# ================= VENTAS DIARIAS =================
@estadisticas_bp.route("/ventas-diarias", methods=["GET"])
def get_ventas_diarias():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT
                DATE(fecha_creacion) AS fecha,
                COUNT(*) AS num_pedidos,
                SUM(total) AS total_ventas
            FROM pedidos
            WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'
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
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT 
                pr.nombre,
                pr.categoria,
                SUM(pd.cantidad) AS total_vendido,
                SUM(pd.subtotal) AS ingresos_generados
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
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT 
                pr.categoria,
                COUNT(pd.id) AS productos_vendidos,
                SUM(pd.subtotal) AS total_ingresos
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
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT 
                (SELECT COUNT(*) FROM productos) AS total_productos,
                (SELECT COUNT(*) FROM pedidos) AS total_pedidos,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'Pendiente') AS pedidos_pendientes,
                (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE estado = 'Completado') AS ventas_totales,
                (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE fecha_creacion::date = CURRENT_DATE AND estado = 'Completado') AS ventas_hoy
        """)
        resumen = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({"success": True, "data": resumen})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
