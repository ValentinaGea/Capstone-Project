# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
import psycopg2.extras  # necesario para RealDictCursor

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == "admin" and password == "admin123":
        return jsonify({
            "success": True,
            "user": {"id": 0, "username": "admin", "rol": "admin"}
        })

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "SELECT id, username, rol FROM usuarios WHERE username=%s AND password=%s",
            (username, password)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return jsonify({"success": True, "user": user})
        return jsonify({"success": False, "message": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= CREAR USUARIO =================
@auth_bp.route("/usuarios", methods=["POST"])
def crear_usuario():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    rol = data.get("rol", "user")

    if not username or not password:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    if data.get("requester") != "admin":
        return jsonify({"success": False, "message": "No tienes permiso"}), 403

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO usuarios (username, password, rol) VALUES (%s, %s, %s)",
            (username, password, rol)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Usuario creado correctamente"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= LISTAR USUARIOS =================
@auth_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id, username, rol, fecha_creacion FROM usuarios ORDER BY id ASC")
        usuarios = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify({"success": True, "data": usuarios})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= ELIMINAR USUARIO =================
@auth_bp.route("/usuarios/<int:user_id>", methods=["DELETE"])
def eliminar_usuario(user_id):
    requester = request.args.get("requester", "")
    if requester != "admin":
        return jsonify({"success": False, "message": "No tienes permiso"}), 403

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM usuarios WHERE id=%s", (user_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"success": True, "message": "Usuario eliminado correctamente"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
