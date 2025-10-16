from db import get_db_connection
import psycopg2.extras

def check_login(username, password):
    """
    Verifica credenciales:
    - Si es admin -> acceso total
    - Si está en DB -> acceso limitado
    """
    if username == "admin" and password == "admin123":
        return {"rol": "admin"}

    conn = get_db_connection()
    if not conn:
        return None

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT id, username, rol FROM usuarios WHERE username=%s AND password=%s",
        (username, password)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    return user if user else None
