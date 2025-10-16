# Coffee Manager

**Coffee Manager** es una aplicación web de gestión para cafeterías.
Permite administrar productos, pedidos, usuarios y visualizar estadísticas de ventas de forma sencilla y moderna.

---

## Características principales

- **Gestión de productos:** creación, edición y eliminación de productos.
- **Gestión de pedidos:** ver, actualizar el estado y registrar nuevos pedidos.
- **Dashboard:** resumen de ventas diarias, productos más vendidos y ventas por categoría.
- **Gestión de usuarios (solo admin):** visualización y creación de usuarios.
- **Sistema de roles:**
  - **Admin:** acceso completo (productos, pedidos, usuarios, estadísticas).
  - **User:** acceso limitado (productos, pedidos, dashboard).

---

## Tecnologías utilizadas

### **Frontend**
- React.js
- Axios
- React Router
- CSS / TailwindCSS

### **Backend**
- Flask (Python)
- Flask-CORS
- psycopg2 (PostgreSQL)
- Gunicorn (para despliegue)
- Render (hosting backend)
- Vercel (hosting frontend)

### **Base de datos**
- PostgreSQL (Render)
- Migración desde MySQL mediante **pgAdmin4**

---

## Problemas encontrados y cómo se resolvieron

Durante el despliegue del proyecto surgieron algunos inconvenientes importantes que se solucionaron paso a paso:

### Base de datos no accesible en Render

Inicialmente, el backend usaba **MySQL local**, que Render no podía alcanzar desde la nube.
**Solución:** se exportó la base de datos local y se migró a **PostgreSQL** usando **pgAdmin4**.
Luego se creó una base de datos PostgreSQL en Render y se conectó usando la variable de entorno:

```
DATABASE_URL=postgresql://cmuser:TU_PASSWORD@dpg-xxxxxx:5432/coffeemanager_db?sslmode=require
```

El backend fue adaptado para usar **psycopg2** en lugar de MySQL.

---

### Errores de conexión entre frontend y backend (CORS)

Al desplegar el frontend en **Vercel**, las peticiones hacia Render eran bloqueadas por CORS.
**Solución:** se activó **Flask-CORS** en el backend para permitir solicitudes desde el dominio del frontend.

---

### Configuración del despliegue

Se ajustó el **Procfile** y la configuración de Render:

```
Root Directory = backend
Start Command = gunicorn app:app
```

De esta forma el backend pudo correr correctamente en producción.

---

Con estos cambios, la aplicación quedó completamente funcional en la nube, con comunicación correcta entre frontend, backend y base de datos.

