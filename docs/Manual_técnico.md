# 📘 Manual Técnico - HuellarioSoft API

**Versión:** 1.0.0  
**Fecha:** Mayo 2026  
**Autores:** [Natalia Sierra Salamando](https://www.linkedin.com/in/nataliasierradev-frontend/), [Cristian Leandro Pérez Peláez](https://www.linkedin.com/in/clperez341/)

---

## 📑 Índice

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Requisitos Previos](#3-requisitos-previos)
4. [Instalación y Configuración](#4-instalación-y-configuración)
5. [Inicialización del Proyecto](#5-inicialización-del-proyecto)
6. [Estructura del Proyecto](#6-estructura-del-proyecto)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [Modelos de Datos](#8-modelos-de-datos)
9. [Endpoints Principales](#9-endpoints-principales)
10. [Seguridad y Autenticación](#10-seguridad-y-autenticación)
11. [Manejo de Errores](#11-manejo-de-errores)
12. [Scripts Disponibles](#12-scripts-disponibles)
13. [Despliegue](#13-despliegue)
14. [Mantenimiento y Troubleshooting](#14-mantenimiento-y-troubleshooting)

---

## 1. Introducción

HuellarioSoft API es el backend completo para un sistema de gestión veterinaria desarrollado con Node.js, Express.js y MongoDB. Implementa una arquitectura en capas escalable con autenticación JWT, control de acceso basado en roles (RBAC) y una API RESTful bien estructurada.

### Características Principales

- 🔐 Autenticación JWT con refresh tokens
- 👥 Sistema de roles (administrador, veterinario, recepcionista, auxiliar)
- 📊 Gestión completa de pacientes veterinarios
- 📅 Sistema de citas y calendario
- 📋 Historia clínica electrónica
- 💰 Facturación y reportes
- 📦 Control de inventario
- 📧 Envío de correos electrónicos
- 📄 Generación de PDFs

---

## 2. Arquitectura del Sistema

### Patrón de Diseño

El proyecto utiliza una **arquitectura en capas** que separa responsabilidades:

```
┌─────────────────────────────────────┐
│         Routes (Rutas)              │  ← Definición de endpoints
├─────────────────────────────────────┤
│      Validators (Validadores)       │  ← Validación de entrada
├─────────────────────────────────────┤
│     Middlewares (Autenticación)     │  ← Autenticación y autorización
├─────────────────────────────────────┤
│    Controllers (Controladores)      │  ← Manejo de peticiones HTTP
├─────────────────────────────────────┤
│       Services (Servicios)          │  ← Lógica de negocio
├─────────────────────────────────────┤
│         Models (Modelos)            │  ← Esquemas de MongoDB
└─────────────────────────────────────┘
```

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | ≥18.0.0 | Runtime de JavaScript |
| Express.js | ^4.19.2 | Framework web |
| MongoDB | ≥6.0 | Base de datos NoSQL |
| Mongoose | ^8.3.2 | ODM para MongoDB |
| JWT | ^9.0.2 | Autenticación |
| bcrypt | ^5.1.1 | Hash de contraseñas |
| Express Validator | ^7.0.1 | Validación de datos |
| Multer | ^1.4.5 | Carga de archivos |
| PDFKit | ^0.18.0 | Generación de PDFs |
| Nodemailer | ^6.9.13 | Envío de emails |

---

## 3. Requisitos Previos

### Software Requerido

- **Node.js**: Versión 18.0.0 o superior
- **MongoDB**: Versión 6.0 o superior
- **npm**: Versión 9.0.0 o superior
- **Git**: Para control de versiones

### Verificar Instalaciones

```bash
node --version    # Debe mostrar v18.0.0 o superior
npm --version     # Debe mostrar 9.0.0 o superior
mongod --version  # Debe mostrar MongoDB 6.0 o superior
```

### Conocimientos Técnicos Recomendados

- JavaScript ES6+
- Node.js y Express.js
- MongoDB y Mongoose
- Autenticación JWT
- API RESTful
- Patrones de diseño MVC

---

## 4. Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/clpp-dev/api-huellariosoft.git
cd api-huellariosoft
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`.

### Paso 3: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del servidor
NODE_ENV=development
PORT=5000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/huellariosoft

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=tu_refresh_token_secret_muy_seguro
REFRESH_TOKEN_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Nodemailer
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_password_de_aplicacion

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

> ⚠️ **Importante**: Nunca subir el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.

### Paso 4: Verificar Conexión a MongoDB

Asegurarse de que MongoDB está corriendo:

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

---

## 5. Inicialización del Proyecto

### 5.1 Crear Usuario Administrador Inicial

**Antes de iniciar el servidor por primera vez**, es necesario crear un usuario administrador para acceder al sistema.

Ejecutar el script de creación de administrador:

```bash
node createAdmin.js
```

**Salida esperada:**

```
✅ Usuario administrador creado exitosamente

📧 Email: admin@huellariosoft.com
🔑 Password: 123456Usuario

⚠️  IMPORTANTE: Cambia la contraseña después del primer login
```

**Credenciales por defecto:**
- **Email**: `admin@huellariosoft.com`
- **Password**: `123456Usuario`
- **Rol**: `administrador`

> ⚠️ **Seguridad**: Cambiar la contraseña inmediatamente después del primer inicio de sesión.

### 5.2 Iniciar el Servidor

#### Modo Desarrollo (con nodemon)

```bash
npm run dev
```

#### Modo Producción

```bash
npm start
```

**Salida esperada:**

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║          🐾 HUELLARIOSOFT API 🐾                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

🚀 Servidor corriendo en: http://localhost:5000
📝 Entorno: development
🔗 API Base: http://localhost:5000/api
💚 Health Check: http://localhost:5000/health
```

### 5.3 Verificar Instalación

Realizar una petición al endpoint de health check:

```bash
curl http://localhost:5000/health
```

**Respuesta esperada:**

```json
{
  "status": "OK",
  "message": "HuellarioSoft API funcionando correctamente",
  "timestamp": "2026-05-03T10:30:00.000Z"
}
```

---

## 6. Estructura del Proyecto

```
api-huellariosoft/
├── createAdmin.js              # Script para crear administrador inicial
├── package.json                # Dependencias y scripts
├── .env                        # Variables de entorno (no versionado)
├── .gitignore                  # Archivos ignorados por Git
├── README.md                   # Documentación general
│
├── docs/                       # Documentación técnica
│   └── Manual_técnico.md       # Este archivo
│
└── src/                        # Código fuente
    ├── app.js                  # Configuración de Express
    ├── server.js               # Punto de entrada del servidor
    │
    ├── config/                 # Configuraciones
    │   ├── config.js           # Variables centralizadas
    │   └── database.js         # Conexión a MongoDB
    │
    ├── models/                 # Modelos de Mongoose
    │   ├── User.js             # Usuario del sistema
    │   ├── Propietario.js      # Dueños de mascotas
    │   ├── Mascota.js          # Pacientes veterinarios
    │   ├── Cita.js             # Citas agendadas
    │   ├── HistoriaClinica.js  # Registro médico
    │   ├── Inventario.js       # Productos e insumos
    │   └── Factura.js          # Facturas
    │
    ├── routes/                 # Definición de rutas
    │   ├── index.js            # Router principal
    │   ├── auth.routes.js      # Autenticación
    │   ├── user.routes.js      # Usuarios
    │   ├── propietario.routes.js
    │   ├── mascota.routes.js
    │   ├── cita.routes.js
    │   ├── historiaClinica.routes.js
    │   ├── inventario.routes.js
    │   ├── factura.routes.js
    │   └── reporte.routes.js
    │
    ├── controllers/            # Controladores HTTP
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── propietario.controller.js
    │   ├── mascota.controller.js
    │   ├── cita.controller.js
    │   ├── historiaClinica.controller.js
    │   ├── inventario.controller.js
    │   ├── factura.controller.js
    │   └── reporte.controller.js
    │
    ├── services/               # Lógica de negocio
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── email.service.js
    │   └── ...
    │
    ├── middlewares/            # Middlewares personalizados
    │   ├── auth.js             # Verificación JWT
    │   ├── validation.js       # Manejo de validaciones
    │   ├── errorHandler.js     # Manejo de errores
    │   └── upload.js           # Configuración de Multer
    │
    ├── validators/             # Validadores con Express Validator
    │   ├── auth.validator.js
    │   ├── mascota.validator.js
    │   ├── propietario.validator.js
    │   └── cita.validator.js
    │
    └── utils/                  # Utilidades
        ├── errors.js           # Clases de error personalizadas
        ├── responses.js        # Respuestas estandarizadas
        ├── asyncHandler.js     # Wrapper para async/await
        ├── pdfGenerator.js     # Generación de PDFs
        └── reportGenerator.js  # Generación de reportes
```

---

## 7. Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development`, `production` |
| `PORT` | Puerto del servidor | `5000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/huellariosoft` |
| `JWT_SECRET` | Clave secreta para JWT | Cadena aleatoria segura |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1h`, `24h` |
| `REFRESH_TOKEN_SECRET` | Clave para refresh tokens | Cadena aleatoria segura |
| `REFRESH_TOKEN_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `BCRYPT_SALT_ROUNDS` | Rounds para bcrypt | `10` |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:5173` |

### Variables Opcionales

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `MAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_SECURE` | Usar TLS | `false` |
| `MAIL_USER` | Usuario de email | - |
| `MAIL_PASSWORD` | Contraseña de email | - |
| `UPLOAD_DIR` | Directorio de uploads | `uploads` |
| `MAX_FILE_SIZE` | Tamaño máximo de archivo | `5242880` (5MB) |

---

## 8. Modelos de Datos

### User (Usuario)

```javascript
{
  nombre: String,           // Nombre completo
  email: String,            // Email único
  password: String,         // Hash de contraseña
  rol: String,              // 'administrador', 'veterinario', 'recepcionista'
  telefono: String,         // Teléfono de contacto
  activo: Boolean,          // Estado del usuario
  refreshTokens: [String],  // Tokens de refresco activos
  createdAt: Date,
  updatedAt: Date
}
```

### Propietario

```javascript
{
  nombre: String,           // Nombre completo
  documento: String,        // Documento de identidad único
  email: String,
  telefono: String,
  direccion: String,
  ciudad: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Mascota

```javascript
{
  nombre: String,           // Nombre de la mascota
  especie: String,          // 'perro', 'gato', 'otro'
  raza: String,
  fechaNacimiento: Date,
  sexo: String,             // 'macho', 'hembra'
  color: String,
  peso: Number,             // En kilogramos
  propietario: ObjectId,    // Referencia a Propietario
  foto: String,             // Ruta de la foto
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cita

```javascript
{
  mascota: ObjectId,        // Referencia a Mascota
  veterinario: ObjectId,    // Referencia a User
  fecha: Date,              // Fecha y hora de la cita
  motivo: String,           // Motivo de consulta
  estado: String,           // 'programada', 'completada', 'cancelada'
  observaciones: String,
  createdAt: Date,
  updatedAt: Date
}
```

### HistoriaClinica

```javascript
{
  mascota: ObjectId,        // Referencia a Mascota
  veterinario: ObjectId,    // Referencia a User
  fecha: Date,
  motivo: String,           // Motivo de consulta
  diagnostico: String,
  tratamiento: String,
  medicamentos: [String],
  examenes: [String],
  vacunas: [{
    nombre: String,
    fecha: Date,
    proximaDosis: Date
  }],
  archivos: [String],       // Rutas de archivos adjuntos
  observaciones: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventario

```javascript
{
  nombre: String,           // Nombre del producto
  descripcion: String,
  categoria: String,        // 'medicamento', 'insumo', 'alimento'
  cantidad: Number,
  unidadMedida: String,     // 'unidades', 'ml', 'mg', 'kg'
  precioCompra: Number,
  precioVenta: Number,
  stockMinimo: Number,      // Alerta de stock bajo
  fechaVencimiento: Date,
  proveedor: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Factura

```javascript
{
  numero: String,           // Número de factura único
  cliente: ObjectId,        // Referencia a Propietario
  items: [{
    descripcion: String,
    cantidad: Number,
    precioUnitario: Number,
    subtotal: Number
  }],
  subtotal: Number,
  iva: Number,
  total: Number,
  metodoPago: String,       // 'efectivo', 'tarjeta', 'transferencia'
  estado: String,           // 'pagada', 'pendiente', 'anulada'
  fecha: Date,
  observaciones: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 9. Endpoints Principales

### Base URL

```
http://localhost:5000/api
```

### 9.1 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| POST | `/auth/refresh` | Refrescar token | No |
| GET | `/auth/me` | Obtener usuario actual | Sí |

### 9.2 Usuarios

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/users` | Listar usuarios | administrador |
| GET | `/users/:id` | Obtener usuario | administrador |
| POST | `/users` | Crear usuario | administrador |
| PUT | `/users/:id` | Actualizar usuario | administrador |
| DELETE | `/users/:id` | Eliminar usuario | administrador |

### 9.3 Propietarios

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/propietarios` | Listar propietarios | todos autenticados |
| GET | `/propietarios/:id` | Obtener propietario | todos autenticados |
| POST | `/propietarios` | Crear propietario | administrador, recepcionista |
| PUT | `/propietarios/:id` | Actualizar propietario | administrador, recepcionista |
| DELETE | `/propietarios/:id` | Eliminar propietario | administrador |

### 9.4 Mascotas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/mascotas` | Listar mascotas | todos autenticados |
| GET | `/mascotas/:id` | Obtener mascota | todos autenticados |
| POST | `/mascotas` | Crear mascota | administrador, recepcionista |
| PUT | `/mascotas/:id` | Actualizar mascota | administrador, recepcionista, veterinario |
| DELETE | `/mascotas/:id` | Eliminar mascota | administrador |

### 9.5 Citas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/citas` | Listar citas | todos autenticados |
| GET | `/citas/:id` | Obtener cita | todos autenticados |
| POST | `/citas` | Crear cita | administrador, recepcionista |
| PUT | `/citas/:id` | Actualizar cita | administrador, recepcionista, veterinario |
| DELETE | `/citas/:id` | Cancelar cita | administrador, recepcionista |

### 9.6 Historia Clínica

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/historia-clinica` | Listar registros | veterinario, administrador |
| GET | `/historia-clinica/:id` | Obtener registro | veterinario, administrador |
| POST | `/historia-clinica` | Crear registro | veterinario |
| PUT | `/historia-clinica/:id` | Actualizar registro | veterinario |

### 9.7 Inventario

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/inventario` | Listar productos | todos autenticados |
| GET | `/inventario/:id` | Obtener producto | todos autenticados |
| POST | `/inventario` | Crear producto | administrador |
| PUT | `/inventario/:id` | Actualizar producto | administrador |
| DELETE | `/inventario/:id` | Eliminar producto | administrador |

### 9.8 Facturas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/facturas` | Listar facturas | administrador, recepcionista |
| GET | `/facturas/:id` | Obtener factura | administrador, recepcionista |
| POST | `/facturas` | Crear factura | administrador, recepcionista |
| GET | `/facturas/:id/pdf` | Generar PDF | administrador, recepcionista |

### 9.9 Reportes

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/reportes/dashboard` | Estadísticas generales | administrador |
| GET | `/reportes/ingresos` | Reporte de ingresos | administrador |
| GET | `/reportes/inventario` | Reporte de inventario | administrador |
| GET | `/reportes/citas` | Reporte de citas | administrador, veterinario |

---

## 10. Seguridad y Autenticación

### Sistema de Autenticación JWT

La API utiliza JSON Web Tokens (JWT) para autenticación. El flujo es:

1. **Login**: Usuario envía credenciales → Recibe `accessToken` y `refreshToken`
2. **Peticiones**: Cliente incluye `accessToken` en header `Authorization: Bearer <token>`
3. **Refresh**: Cuando `accessToken` expira, usar `refreshToken` para obtener nuevo token

### Headers Requeridos

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **administrador** | Acceso total al sistema |
| **veterinario** | Gestión de citas, historia clínica, ver propietarios y mascotas |
| **recepcionista** | Gestión de citas, propietarios, mascotas, facturas (sin acceso a usuarios) |
| **auxiliar** | Gestión de citas y facturas (operaciones del día a día) |

### Middleware de Autenticación

```javascript
// Verificar token JWT
auth.verifyToken

// Verificar roles específicos
auth.authorize(['administrador', 'veterinario'])
```

### Hash de Contraseñas

Las contraseñas se hashean con bcrypt usando 10 salt rounds antes de almacenarse en la base de datos. Nunca se almacenan en texto plano.

---

## 11. Manejo de Errores

### Tipos de Error

La API utiliza clases de error personalizadas:

- **NotFoundError**: Recurso no encontrado (404)
- **ValidationError**: Error de validación (400)
- **UnauthorizedError**: No autenticado (401)
- **ForbiddenError**: Sin permisos (403)
- **ConflictError**: Conflicto de recursos (409)

### Formato de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "TipoDeError",
  "details": {}
}
```

### Middleware de Manejo de Errores

El middleware `errorHandler.js` captura todos los errores y devuelve respuestas consistentes al cliente.

---

## 12. Scripts Disponibles

### Desarrollo

```bash
# Iniciar en modo desarrollo con auto-reload
npm run dev
```

### Producción

```bash
# Iniciar servidor en modo producción
npm start
```

### Utilidades

```bash
# Crear usuario administrador inicial
node createAdmin.js
```

---

## 13. Despliegue

### Consideraciones de Producción

1. **Variables de Entorno**: Configurar todas las variables en el servidor
2. **MongoDB**: Usar MongoDB Atlas o servidor dedicado
3. **Seguridad**: 
   - Cambiar `JWT_SECRET` por valor aleatorio seguro
   - Configurar CORS correctamente
   - Usar HTTPS
4. **Performance**: 
   - Habilitar compresión
   - Configurar rate limiting
   - Implementar caché donde sea apropiado

### Despliegue en Render.com

Render.com es la plataforma utilizada actualmente para el despliegue de HuellarioSoft API.

#### Paso 1: Preparar MongoDB Atlas

Antes de desplegar, asegurarse de tener una base de datos MongoDB en MongoDB Atlas:

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Configurar acceso de red (IP Whitelist: `0.0.0.0/0` para permitir todas las IPs)
4. Crear usuario de base de datos
5. Obtener connection string: `mongodb+srv://<usuario>:<password>@cluster.mongodb.net/huellariosoft`

#### Paso 2: Desplegar en Render

1. **Iniciar sesión en Render**
   - Ir a [render.com](https://render.com)
   - Iniciar sesión o crear cuenta

2. **Vincular repositorio de GitHub**
   - Click en "New +" → "Web Service"
   - Conectar con GitHub (autorizar acceso si es primera vez)
   - Seleccionar el repositorio del backend

3. **Configurar el servicio**
   - **Name**: `huellariosoft-api` (o el nombre que prefieras)
   - **Environment**: `Node`
   - **Region**: Seleccionar la más cercana
   - **Branch**: `main` (o la rama que uses)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (o el plan que necesites)

4. **Agregar variables de entorno**
   
   En la sección "Environment Variables", agregar todas las variables necesarias:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/huellariosoft
   JWT_SECRET=<genera_una_clave_segura_aleatoria>
   JWT_EXPIRES_IN=1h
   REFRESH_TOKEN_SECRET=<genera_otra_clave_segura_aleatoria>
   REFRESH_TOKEN_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=10
   ALLOWED_ORIGINS=https://tu-frontend.com
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_SECURE=false
   MAIL_USER=tu_email@gmail.com
   MAIL_PASSWORD=tu_password_de_aplicacion
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

5. **Hacer Deploy**
   - Click en "Create Web Service"
   - Render automáticamente hará el build y deploy
   - Esperar a que el despliegue finalice (generalmente 2-5 minutos)

6. **Verificar el despliegue**
   
   Una vez completado, tu API estará disponible en:
   ```
   https://huellariosoft-api.onrender.com
   ```
   
   Probar el health check:
   ```bash
   curl https://huellariosoft-api.onrender.com/health
   ```

#### Paso 3: Crear usuario administrador

Después del primer despliegue, es necesario crear el usuario administrador:

1. En Render, ir a tu servicio → "Shell"
2. Ejecutar el comando:
   ```bash
   node createAdmin.js
   ```

#### Actualizaciones automáticas

Render está configurado para hacer auto-deploy cuando detecta cambios en la rama principal:

1. Hacer commit y push a la rama configurada
2. Render automáticamente detecta los cambios
3. Realiza nuevo build y deploy automáticamente
4. La aplicación se actualiza sin intervención manual

#### Logs y Monitoreo

- **Ver logs**: En el dashboard de Render → Pestaña "Logs"
- **Métricas**: Pestaña "Metrics" para ver uso de CPU, memoria y ancho de banda
- **Eventos**: Pestaña "Events" para historial de deploys

#### Consideraciones de Render

- **Plan Free**: El servicio se suspende después de 15 minutos de inactividad. El primer request después de la suspensión puede tardar 30-50 segundos en responder (cold start).
- **Plan Paid**: El servicio está siempre activo, sin suspensiones.
- **SSL/HTTPS**: Render proporciona certificados SSL gratuitos automáticamente.
- **Dominio personalizado**: Se puede configurar un dominio propio en la configuración del servicio.

---

## 14. Mantenimiento y Troubleshooting

### Logs

Los logs se muestran en consola usando Morgan en formato `dev` (desarrollo) o `combined` (producción).

### Problemas Comunes

#### Error de conexión a MongoDB

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solución**: Verificar que MongoDB está corriendo y la URI es correcta.

#### Token expirado

```
401 Unauthorized: Token has expired
```

**Solución**: Usar el endpoint `/auth/refresh` con el refresh token.

#### Puerto en uso

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solución**: Cambiar el puerto en `.env` o detener el proceso que usa el puerto.

### Respaldo de Base de Datos

```bash
# Crear respaldo
mongodump --uri="mongodb://localhost:27017/huellariosoft" --out=./backup

# Restaurar respaldo
mongorestore --uri="mongodb://localhost:27017/huellariosoft" ./backup/huellariosoft
```

### Monitoreo

- **Health checks**: Endpoint `/health`

---

## 📞 Soporte

Para soporte técnico o reportar problemas, contactar al equipo de desarrollo de HuellarioSoft.

- <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png" width="20" height="20"/> [Natalia Sierra Salamando](https://www.linkedin.com/in/nataliasierradev-frontend/)
- <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png" width="20" height="20"/> [Cristian Leandro Pérez Peláez](https://www.linkedin.com/in/clperez341/)
