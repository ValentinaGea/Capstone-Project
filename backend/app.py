# backend/app.py
from flask import Flask, render_template_string
from flask_cors import CORS
from datetime import datetime

# Importar los blueprints
from routes.auth import auth_bp
from routes.productos import productos_bp
from routes.pedidos import pedidos_bp
from routes.estadisticas import estadisticas_bp

app = Flask(__name__)

# ================= CORS =================
# Permitir acceso a todos los orígenes
CORS(app, origins=[
    "http://localhost:3000", 
    "https://capstone-project-gules-chi.vercel.app/login",
    "https://coffee-manager-6ghx.onrender.com"])

# ================= REGISTRO DE BLUEPRINTS =================
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(productos_bp, url_prefix="/api/productos")
app.register_blueprint(pedidos_bp, url_prefix="/api/pedidos")
app.register_blueprint(estadisticas_bp, url_prefix="/api/estadisticas")

# ================= RUTA DE PRUEBA =================
@app.route("/")
def index():
    return render_template_string(f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>CoffeeManager Backend</title>
        </head>
        <body>
            <h1>CoffeeManager Backend</h1>
            <p>La API está funcionando correctamente</p>
            <p>Fecha y hora actual: {datetime.now().isoformat()}</p>
            <h3>Rutas disponibles:</h3>
            <ul>
                <li><b>Auth</b>
                    <ul>
                        <li>POST /api/auth/login</li>
                        <li>POST /api/auth/usuarios</li>
                        <li>GET /api/auth/usuarios</li>
                    </ul>
                </li>
                <li><b>Productos</b>
                    <ul>
                        <li>GET /api/productos/</li>
                        <li>POST /api/productos/</li>
                        <li>PUT /api/productos/&lt;id&gt;</li>
                        <li>DELETE /api/productos/&lt;id&gt;</li>
                    </ul>
                </li>
                <li><b>Pedidos</b>
                    <ul>
                        <li>GET /api/pedidos/</li>
                        <li>POST /api/pedidos/</li>
                        <li>PUT /api/pedidos/&lt;id&gt;/estado</li>
                    </ul>
                </li>
                <li><b>Estadísticas</b>
                    <ul>
                        <li>GET /api/estadisticas/ventas-diarias</li>
                        <li>GET /api/estadisticas/productos-populares</li>
                        <li>GET /api/estadisticas/ventas-categoria</li>
                        <li>GET /api/estadisticas/dashboard</li>
                    </ul>
                </li>
            </ul>
        </body>
        </html>
    """)

# ================= MAIN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
