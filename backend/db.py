from config import DB_CONFIG
import mysql.connector  # o psycopg2 si usas PostgreSQL

def get_db_connection():
    """Devuelve una conexión a la base de datos usando DB_CONFIG"""
    conn = mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"],
        port=DB_CONFIG["port"]
    )
    return conn