# 📘 Guía de Inicio Rápido - HuellarioSoft API

Esta guía te ayudará a levantar el proyecto en menos de 10 minutos.

## ⚡ Inicio Rápido

### 1️⃣ Preparar el Entorno

```powershell
# 1. Verificar versión de Node.js
node --version  # Debe ser >= 18.0.0

# 2. Verificar MongoDB
# Si tienes MongoDB local:
mongod --version

# O usa MongoDB Atlas (recomendado para desarrollo):
# https://www.mongodb.com/cloud/atlas
```

### 2️⃣ Instalar Dependencias

```powershell
# Instalar todas las dependencias del proyecto
npm install
```

### 3️⃣ Configurar Variables de Entorno

```powershell
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar el archivo .env con tus configuraciones
notepad .env
```

**Configuración mínima para empezar:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
```

### 4️⃣ Crear Usuario Administrador

```powershell
# Ejecutar script para crear el primer admin
node createAdmin.js
```

Salida esperada:
```
✅ Usuario administrador creado exitosamente

📧 Email: admin@huellariosoft.com
🔑 Password: 123456Usuario

⚠️  IMPORTANTE: Cambia la contraseña después del primer login
```

### 5️⃣ Iniciar el Servidor

```powershell
# Modo desarrollo (con auto-reload)
npm run dev
```

Salida esperada:
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║          🐾 HUELLARIOSOFT API 🐾                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

🚀 Servidor corriendo en: http://localhost:3000
📝 Entorno: development
🔗 API Base: http://localhost:3000/api
💚 Health Check: http://localhost:3000/health

📚 Endpoints disponibles:
   - Auth:              /api/auth
   - Usuarios:          /api/users
   - Propietarios:      /api/propietarios
   - Mascotas:          /api/mascotas
   - Citas:             /api/citas
   - Historia Clínica:  /api/historias-clinicas
   - Inventario:        /api/inventario
   - Facturas:          /api/facturas

✅ Servidor listo para recibir peticiones
```

### 6️⃣ Probar la API

**Opción A: Navegador**
```
Abre tu navegador en: http://localhost:3000/health
```

**Opción B: PowerShell**
```powershell
# Health check
curl http://localhost:3000/health

# Login con el admin creado
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@huellariosoft.com\",\"password\":\"123456Usuario\"}'
```

**Opción C: Thunder Client (VS Code)**
1. Instala la extensión "Thunder Client"
2. Crea una nueva petición
3. POST: `http://localhost:3000/api/auth/login`
4. Body (JSON):
```json
{
  "email": "admin@huellariosoft.com",
  "password": "123456Usuario"
}
```

## 🎯 Primer Flujo Completo

### 1. Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@huellariosoft.com",
  "password": "123456Usuario"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "...",
      "nombre": "Administrador",
      "email": "admin@huellariosoft.com",
      "rol": "administrador"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Crear Propietario
```http
POST http://localhost:3000/api/propietarios
Authorization: Bearer <tu_accessToken>
Content-Type: application/json

{
  "nombreCompleto": "Juan Pérez",
  "documento": "1234567890",
  "telefono": "3001234567",
  "email": "juan@example.com",
  "direccion": "Calle 123 #45-67"
}
```

### 3. Crear Mascota
```http
POST http://localhost:3000/api/mascotas
Authorization: Bearer <tu_accessToken>
Content-Type: application/json

{
  "nombre": "Max",
  "especie": "Canino",
  "raza": "Golden Retriever",
  "sexo": "Macho",
  "edad": {
    "valor": 3,
    "unidad": "años"
  },
  "peso": 25.5,
  "propietario": "<id_del_propietario>"
}
```

## 🛠️ Comandos Útiles

```powershell
# Iniciar en modo desarrollo
npm run dev

# Iniciar en modo producción
npm start

# Ver logs de MongoDB (si es local)
# En otra terminal:
mongod --dbpath C:\data\db

# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
```powershell
# Verificar que MongoDB está corriendo
# Windows:
net start MongoDB

# O iniciar manualmente:
mongod
```

### Error: "Port 3000 is already in use"
```powershell
# Cambiar el puerto en .env
PORT=3001

# O matar el proceso que usa el puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Module not found"
```powershell
# Reinstalar dependencias
npm install
```

### Error de autenticación JWT
```powershell
# Verificar que JWT_SECRET está configurado en .env
# Generar nuevo secret si es necesario
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📚 Siguientes Pasos

1. ✅ Explora todos los endpoints disponibles
2. ✅ Lee la documentación de cada módulo en `/Docs`
3. ✅ Configura Postman/Thunder Client con colecciones
4. ✅ Implementa el frontend
5. ✅ Configura MongoDB Atlas para producción
6. ✅ Implementa tests automatizados

## 🎓 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

## 💡 Tips de Desarrollo

1. **Usa nodemon**: Ya configurado con `npm run dev`
2. **Revisa los logs**: Morgan muestra todas las peticiones HTTP
3. **Usa variables de entorno**: Nunca hardcodees credenciales
4. **Prueba con diferentes roles**: Crea usuarios de cada tipo
5. **Documenta tus cambios**: Mantén el README actualizado

---

¿Problemas? Abre un issue o contacta al equipo de desarrollo 🚀
