import os

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "database": os.environ.get("DB_NAME", "coffeemanager_db"),
    "user": os.environ.get("DB_USER", "cmuser"),
    "password": os.environ.get("DB_PASSWORD", "123456"),
    "port": int(os.environ.get("DB_PORT", 5432))
}

DEBUG = os.environ.get("DEBUG", "True") == "True"