import os
from dotenv import load_dotenv

# Cargar archivo .env
load_dotenv()

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "database": os.environ.get("DB_NAME", "coffeemanager_db"),
    "user": os.environ.get("DB_USER", "cmuser"),
    "password": os.environ.get("DB_PASSWORD", "123456"),
    "port": int(os.environ.get("DB_PORT", 3306))
}

DEBUG = os.environ.get("DEBUG", "True") == "True"
