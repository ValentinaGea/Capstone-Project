import os
from urllib.parse import urlparse
import psycopg2
from dotenv import load_dotenv

# Cargar variables de .env
load_dotenv()

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise ValueError("❌ DATABASE_URL no encontrada. Revisa tu .env")

def get_db_connection():
    url = urlparse(DB_URL)
    conn = psycopg2.connect(
        dbname=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
    return conn
