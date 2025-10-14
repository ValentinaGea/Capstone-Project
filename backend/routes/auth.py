# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from db import get_db_connection

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():
    """Login sencillo: admin/admin123 o usuarios desde la DB"""
    data = request.get_json()
    print("Datos recibidos en login:", data)
    username = data.get("username")
    password = data.get("password")

    # Caso especial: admin fijo
    if username == "admin" and password == "admin123":
        return jsonify({
            "success": True,
            "user": {"id": 0, "username": "admin", "rol": "admin"}
        })

    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute(
            "SELECT id, username, rol FROM usuarios WHERE username=%s AND password=%s",
            (username, password)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return jsonify({"success": True, "user": user})
        else:
            return jsonify({"success": False, "message": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================= CREAR USUARIO =================
@auth_bp.route("/usuarios", methods=["POST"])
def crear_usuario():
    """Crear un nuevo usuario (solo admin puede crear)"""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    rol = data.get("rol", "user")

    if not username or not password:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    # Para simplificar, asumimos que el frontend envía un token o usuario admin
    # Aquí solo revisaremos username = "admin" como permiso para crear
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
    """Listar todos los usuarios"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
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
    """Eliminar un usuario (solo admin puede eliminar)"""
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
