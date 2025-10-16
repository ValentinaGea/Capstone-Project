# backend/routes/productos.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
import psycopg2.extras

productos_bp = Blueprint("productos", __name__, url_prefix="/api/productos")

# ================= LISTAR PRODUCTOS =================
@productos_bp.route("/", methods=["GET"])
def get_productos():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
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
    try:
        data = request.get_json()
        if not data.get("nombre") or not data.get("precio"):
            return jsonify({"success": False, "message": "Nombre y precio son obligatorios"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            "INSERT INTO productos (nombre, descripcion, precio, categoria, stock) VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (data["nombre"], data.get("descripcion", ""), data["precio"], data.get("categoria", "General"), data.get("stock", 0))
        )
        producto_id = cur.fetchone()["id"]
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Producto creado", "id": producto_id}), 201
    except Exception as e:
        import traceback
        print(traceback.format_exc())  # <-- log en Render
        return jsonify({"success": False, "message": str(e), "trace": traceback.format_exc()}), 500


# ================= ACTUALIZAR PRODUCTO =================
@productos_bp.route("/<int:producto_id>", methods=["PUT"])
def actualizar_producto(producto_id):
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            "UPDATE productos SET nombre=%s, descripcion=%s, precio=%s, categoria=%s, stock=%s WHERE id=%s",
            (data["nombre"], data.get("descripcion", ""), data["precio"], data.get("categoria", "General"), data.get("stock", 0), producto_id)
        )
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Producto actualizado"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= ELIMINAR PRODUCTO =================
@productos_bp.route("/<int:producto_id>", methods=["DELETE"])
def eliminar_producto(producto_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("DELETE FROM productos WHERE id=%s", (producto_id,))
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Producto eliminado"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
