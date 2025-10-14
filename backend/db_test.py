from db import get_db_connection

def test_connection():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()[0]

        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()

        print(f"✅ Conectado a la base de datos: {db_name}")
        print("📋 Tablas encontradas:")
        for table in tables:
            print("-", table[0])

        cursor.close()
        conn.close()
    else:
        print("❌ Error: no se pudo conectar a la base de datos")

if __name__ == "__main__":
    test_connection()
