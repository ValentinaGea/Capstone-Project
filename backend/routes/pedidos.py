# backend/routes/pedidos.py
from flask import Blueprint, request, jsonify
from db import get_db_connection

pedidos_bp = Blueprint("pedidos", __name__, url_prefix="/api/pedidos")

# ================= LISTAR PEDIDOS =================
@pedidos_bp.route("/", methods=["GET"])
def get_pedidos():
    """Obtener todos los pedidos con sus detalles"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT * FROM pedidos ORDER BY fecha_creacion DESC")
        pedidos = cur.fetchall()

        for pedido in pedidos:
            cur.execute("""
                SELECT pd.*, p.nombre as producto_nombre
                FROM pedido_detalles pd
                JOIN productos p ON pd.producto_id = p.id
                WHERE pd.pedido_id = %s
            """, (pedido["id"],))
            pedido["detalles"] = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({"success": True, "data": pedidos})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ================= CREAR PEDIDO =================
@pedidos_bp.route("/", methods=["POST"])
def crear_pedido():
    """Crear un nuevo pedido con sus productos"""
    try:
        data = request.get_json()

        if not data.get("productos") or len(data["productos"]) == 0:
            return jsonify({"success": False, "message": "Debe incluir al menos un producto"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Crear el pedido
        query_pedido = """
        INSERT INTO pedidos (cliente_nombre, estado, total)
        VALUES (%s, %s, %s)
        """
        values_pedido = (
            data.get("cliente_nombre", "Cliente"),
            data.get("estado", "Pendiente"),
            0,  # total inicial
        )

        cur.execute(query_pedido, values_pedido)
        pedido_id = cur.lastrowid

        # 2. Agregar productos al pedido
        total_pedido = 0
        for producto in data["productos"]:
            cur.execute("SELECT precio FROM productos WHERE id = %s", (producto["producto_id"],))
            precio_resultado = cur.fetchone()

            if not precio_resultado:
                conn.rollback()
                return jsonify({"success": False, "message": f'Producto con ID {producto["producto_id"]} no encontrado'}), 400

            precio_unitario = float(precio_resultado[0])
            cantidad = producto["cantidad"]
            subtotal = precio_unitario * cantidad
            total_pedido += subtotal

            query_detalle = """
            INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
            VALUES (%s, %s, %s, %s, %s)
            """
            values_detalle = (pedido_id, producto["producto_id"], cantidad, precio_unitario, subtotal)
            cur.execute(query_detalle, values_detalle)

        # 3. Actualizar total
        cur.execute("UPDATE pedidos SET total = %s WHERE id = %s", (total_pedido, pedido_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Pedido creado exitosamente", "id": pedido_id, "total": total_pedido}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ================= ACTUALIZAR ESTADO =================
@pedidos_bp.route("/<int:pedido_id>/estado", methods=["PUT"])
def actualizar_estado_pedido(pedido_id):
    """Actualizar el estado de un pedido"""
    try:
        data = request.get_json()
        nuevo_estado = data.get("estado")

        if nuevo_estado not in ["Pendiente", "En_Proceso", "Completado", "Cancelado"]:
            return jsonify({"success": False, "message": "Estado inválido"}), 400

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("UPDATE pedidos SET estado = %s WHERE id = %s", (nuevo_estado, pedido_id))
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"success": False, "message": "Pedido no encontrado"}), 404

        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Estado actualizado exitosamente"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
