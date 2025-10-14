# backend/routes/productos.py
from flask import Blueprint, request, jsonify
from db import get_db_connection

productos_bp = Blueprint("productos", __name__, url_prefix="/api/productos")

# ================= LISTAR PRODUCTOS =================
@productos_bp.route("/", methods=["GET"])
def get_productos():
    """Obtener todos los productos"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM productos ORDER BY id ASC")
        productos = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"success": True, "data": productos})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ================= CREAR PRODUCTO =================
@productos_bp.route("/", methods=["POST"])
def crear_producto():
    """Crear un nuevo producto"""
    try:
        data = request.get_json()

        if not data.get("nombre") or not data.get("precio"):
            return jsonify({"success": False, "message": "Nombre y precio son obligatorios"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        query = """
        INSERT INTO productos (nombre, descripcion, precio, categoria, stock)
        VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            data["nombre"],
            data.get("descripcion", ""),
            data["precio"],
            data.get("categoria", "General"),
            data.get("stock", 0),
        )

        cur.execute(query, values)
        conn.commit()
        producto_id = cur.lastrowid

        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Producto creado exitosamente", "id": producto_id}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ================= ACTUALIZAR PRODUCTO =================
@productos_bp.route("/<int:producto_id>", methods=["PUT"])
def actualizar_producto(producto_id):
    """Actualizar un producto existente"""
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
        UPDATE productos
        SET nombre = %s, descripcion = %s, precio = %s, categoria = %s, stock = %s
        WHERE id = %s
        """
        values = (
            data["nombre"],
            data.get("descripcion", ""),
            data["precio"],
            data.get("categoria", "General"),
            data.get("stock", 0),
            producto_id,
        )

        cur.execute(query, values)
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Producto actualizado exitosamente"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ================= ELIMINAR PRODUCTO =================
@productos_bp.route("/<int:producto_id>", methods=["DELETE"])
def eliminar_producto(producto_id):
    """Eliminar un producto"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Producto eliminado exitosamente"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
