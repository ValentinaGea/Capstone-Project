from config import DB_CONFIG
import psycopg2

def get_db_connection():
    """Devuelve una conexión a la base de datos PostgreSQL usando DB_CONFIG"""
    conn = psycopg2.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        dbname=DB_CONFIG["database"],
        port=DB_CONFIG["port"]
    )
    return conn
