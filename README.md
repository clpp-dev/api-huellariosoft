# 🐾 HuellarioSoft API

**Versión:** 1.0.0

Backend completo para sistema de gestión veterinaria desarrollado con Node.js, Express y MongoDB.

## 📋 Características Principales

- 🔐 Autenticación JWT con refresh tokens
- 👥 Control de acceso basado en roles (RBAC)
- 🏗️ Arquitectura en capas escalable
- ✅ Validación de datos con Express Validator
- ⚠️ Manejo global de errores
- 📁 Carga de archivos con Multer
- 📄 Paginación en listados
- 🔍 Búsquedas avanzadas
- 🌐 API RESTful bien estructurada
- 📊 Generación de reportes y PDFs
- 📧 Envío de correos electrónicos

## 🚀 Módulos del Sistema

### 1. **Autenticación y Usuarios**
- Login/Logout con JWT
- Registro de usuarios
- Gestión de usuarios por roles
- Perfiles de usuario

### 2. **Propietarios**
- CRUD completo de propietarios
- Búsqueda por documento
- Validación de datos

### 3. **Mascotas**
- Registro de mascotas (pacientes)
- Historia clínica automática
- Asociación con propietarios
- Búsqueda avanzada

### 4. **Citas Veterinarias**
- Agendamiento de citas
- Calendario por veterinario
- Estados de citas
- Prevención de conflictos horarios

### 5. **Historia Clínica**
- Registro de consultas
- Vacunas, cirugías y exámenes
- Archivos adjuntos
- Trazabilidad médica completa

### 6. **Inventario**
- Control de medicamentos e insumos
- Alertas de stock bajo
- Entradas y salidas
- Estadísticas

### 7. **Facturación**
- Generación de facturas
- Pago presencial
- Estados de factura
- Reportes de ingresos

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **Express Validator** - Validación de datos
- **Multer** - Carga de archivos
- **Morgan** - Logs HTTP
- **Cors** - Cross-Origin Resource Sharing

## 📦 Instalación y Configuración

### Requisitos Previos
- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0 (local o MongoDB Atlas)
- **npm** >= 9.0.0
- **Git** para control de versiones

### Instalación Local

#### 1. Clonar el repositorio
```bash
git clone https://github.com/clpp-dev/api-huellariosoft.git
cd api-huellariosoft
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de datos
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

# Email (Opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_password_de_aplicacion

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

> ⚠️ **Importante**: Nunca subir el archivo `.env` al repositorio.

#### 4. Verificar MongoDB

Asegurarse de que MongoDB está corriendo:

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

O usar **MongoDB Atlas** (recomendado para producción).

#### 5. Crear usuario administrador inicial

**IMPORTANTE**: Antes de iniciar el servidor, crear el usuario administrador:

```bash
node createAdmin.js
```

**Credenciales por defecto:**
- **Email**: `admin@huellariosoft.com`
- **Password**: `123456Usuario`
- **Rol**: `administrador`

> 🔐 **Seguridad**: Cambiar la contraseña después del primer login.

#### 6. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

#### 7. Verificar instalación

```bash
curl http://localhost:5000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "HuellarioSoft API funcionando correctamente",
  "timestamp": "2026-05-03T10:30:00.000Z"
}
```

## 🏗️ Estructura del Proyecto

```
api-huellariosoft/
├── src/
│   ├── config/           # Configuraciones
│   │   ├── config.js     # Variables de entorno
│   │   └── database.js   # Conexión MongoDB
│   ├── controllers/      # Controladores HTTP
│   ├── services/         # Lógica de negocio
│   ├── models/           # Modelos Mongoose
│   ├── routes/           # Rutas de la API
│   ├── middlewares/      # Middlewares personalizados
│   ├── validators/       # Validaciones
│   ├── utils/            # Utilidades
│   ├── uploads/          # Archivos subidos
│   ├── app.js            # Configuración de Express
│   └── server.js         # Punto de entrada
├── Docs/                 # Documentación
├── createAdmin.js        # Script crear admin
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Despliegue en Producción

### Render.com (Plataforma Actual)

El proyecto está desplegado en Render.com. Para desplegar:

1. **Iniciar sesión en [Render.com](https://render.com)**

2. **Vincular repositorio de GitHub**
   - Click en "New +" → "Web Service"
   - Conectar con GitHub
   - Seleccionar el repositorio del backend

3. **Configurar el servicio**
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Agregar variables de entorno**
   - Configurar todas las variables necesarias (ver sección de variables de entorno)
   - Usar MongoDB Atlas para la base de datos

5. **Deploy**
   - Render automáticamente hará el build y deploy
   - Los cambios en la rama principal se despliegan automáticamente

6. **Crear usuario administrador**
   - Ir a la Shell del servicio en Render
   - Ejecutar: `node createAdmin.js`

**Características de Render:**
- ✅ SSL/HTTPS automático y gratuito
- ✅ Deploy automático con cada push
- ✅ Logs y métricas en tiempo real
- ⚠️ Plan Free: suspensión después de 15 min de inactividad

Para más detalles, consultar el [Manual Técnico](./docs/Manual_técnico.md#13-despliegue).

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso completo al sistema |
| **Veterinario** | Gestión de citas, historia clínica, ver propietarios y mascotas |
| **Recepcionista** | Gestión de citas, propietarios, mascotas, facturas (sin acceso a usuarios) |
| **Auxiliar** | Gestión de citas y facturas (operaciones del día a día) |

## 📚 Endpoints Principales

### Autenticación
```
POST   /api/auth/login              # Login
POST   /api/auth/refresh            # Refrescar token
GET    /api/auth/profile            # Obtener perfil
POST   /api/auth/logout             # Logout
```

### Usuarios
```
GET    /api/users                   # Listar usuarios
GET    /api/users/:id               # Obtener usuario
POST   /api/users                   # Crear usuario
PUT    /api/users/:id               # Actualizar usuario
DELETE /api/users/:id               # Eliminar usuario
```

### Propietarios
```
GET    /api/propietarios            # Listar propietarios
GET    /api/propietarios/:id        # Obtener propietario
POST   /api/propietarios            # Crear propietario
PUT    /api/propietarios/:id        # Actualizar propietario
DELETE /api/propietarios/:id        # Eliminar propietario
```

### Mascotas
```
GET    /api/mascotas                # Listar mascotas
GET    /api/mascotas/:id            # Obtener mascota
POST   /api/mascotas                # Crear mascota
PUT    /api/mascotas/:id            # Actualizar mascota
DELETE /api/mascotas/:id            # Eliminar mascota
```

### Citas
```
GET    /api/citas                   # Listar citas
GET    /api/citas/:id               # Obtener cita
POST   /api/citas                   # Crear cita
PUT    /api/citas/:id               # Actualizar cita
PATCH  /api/citas/:id/cancelar      # Cancelar cita
```

### Historia Clínica
```
GET    /api/historias-clinicas      # Listar historias
GET    /api/historias-clinicas/:id  # Obtener historia
POST   /api/historias-clinicas      # Crear historia
PUT    /api/historias-clinicas/:id  # Actualizar historia
```

### Inventario
```
GET    /api/inventario              # Listar productos
GET    /api/inventario/:id          # Obtener producto
POST   /api/inventario              # Crear producto
PUT    /api/inventario/:id          # Actualizar producto
PATCH  /api/inventario/:id/cantidad # Actualizar cantidad
```

### Facturas
```
GET    /api/facturas                # Listar facturas
GET    /api/facturas/:id            # Obtener factura
POST   /api/facturas                # Crear factura
PATCH  /api/facturas/:id/pagar      # Marcar como pagada
PATCH  /api/facturas/:id/anular     # Anular factura
```

## 🧪 Pruebas y Testing

Puedes probar los endpoints usando:
- **Postman** - Cliente API completo
- **Thunder Client** - Extensión de VS Code
- **Insomnia** - Cliente API alternativo
- **cURL** - Línea de comandos

### Ejemplo de Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@huellariosoft.com",
    "password": "123456Usuario"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "nombre": "Administrador",
      "email": "admin@huellariosoft.com",
      "rol": "administrador"
    }
  }
}
```

### Ejemplo de Petición Autenticada

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer <tu-access-token>" \
  -H "Content-Type: application/json"
```

## 🔒 Seguridad

- 🔐 **Contraseñas**: Hasheadas con bcrypt (10 salt rounds)
- 🎫 **Autenticación**: JWT con access y refresh tokens
- ✅ **Validación**: Express Validator en todas las rutas
- 👥 **Autorización**: Control de acceso basado en roles (RBAC)
- 🛡️ **Protección**: Contra inyección NoSQL y XSS
- 🌐 **CORS**: Configurado para orígenes permitidos
- 🔑 **Variables sensibles**: Almacenadas en variables de entorno

## 📝 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development`, `production` |
| `PORT` | Puerto del servidor | `5000` |
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://localhost:27017/huellariosoft` |
| `JWT_SECRET` | Clave secreta JWT | Cadena aleatoria segura |
| `JWT_EXPIRES_IN` | Expiración del access token | `1h` |
| `REFRESH_TOKEN_SECRET` | Clave para refresh tokens | Cadena aleatoria segura |
| `REFRESH_TOKEN_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `BCRYPT_SALT_ROUNDS` | Rounds para bcrypt | `10` |
| `ALLOWED_ORIGINS` | Orígenes permitidos CORS | `http://localhost:5173` |

### Variables Opcionales (Email y Uploads)

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `MAIL_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_SECURE` | Usar TLS | `false` |
| `MAIL_USER` | Usuario de email | - |
| `MAIL_PASSWORD` | Contraseña de email | - |
| `UPLOAD_DIR` | Directorio de uploads | `uploads` |
| `MAX_FILE_SIZE` | Tamaño máximo archivo (bytes) | `5242880` (5MB) |

## 📖 Documentación Completa

- **[Manual Técnico](./docs/Manual_técnico.md)** - Documentación técnica detallada
- [Casos de Uso](./.github/Casos_de_uso.md)
- [Historias de Usuario](./.github/Historias_de_usuario.md)
- [Requisitos Funcionales](./.github/Requisitos_funcionales.md)
- [Requisitos No Funcionales](./.github/Requisitos_no_funcionales.md)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Crear usuario administrador
node createAdmin.js
```

## 🐛 Troubleshooting

### MongoDB no conecta
```bash
# Verificar que MongoDB está corriendo
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl status mongod
```

### Error: Puerto en uso
```bash
# Cambiar el puerto en .env o detener el proceso
# Windows
netstat -ano | findstr :5000
taskkill /PID <numero-de-pid> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Token expirado
Usar el endpoint `/api/auth/refresh` con el refresh token para obtener un nuevo access token.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso privado para HuellarioSoft.

## 👥 Autor

**HuellarioSoft Team**  
📧 Contacto: admin@huellariosoft.com

---

**Última actualización:** Mayo 2026