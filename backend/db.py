from config import get_db_connection

def get_connection():
    """
    Devuelve una conexión a la base de datos PostgreSQL.
    Utiliza la función get_db_connection definida en config.py
    """
    return get_db_connection()
