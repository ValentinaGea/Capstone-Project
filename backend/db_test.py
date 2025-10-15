from config import get_db_connection

def test_connection():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT current_database();")
        db_name = cursor.fetchone()[0]
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
        tables = cursor.fetchall()

        print(f"✅ Conectado a la DB: {db_name}")
        print("Tablas encontradas:")
        for table in tables:
            print("-", table[0])

        cursor.close()
        conn.close()
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    test_connection()
