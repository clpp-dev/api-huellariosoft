# 🐾 HuellarioSoft API

Backend completo para sistema de gestión veterinaria desarrollado con Node.js, Express y MongoDB.

## 📋 Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Arquitectura en capas escalable
- ✅ Validación de datos con Express Validator
- ✅ Manejo global de errores
- ✅ Carga de archivos con Multer
- ✅ Paginación en listados
- ✅ Búsquedas avanzadas
- ✅ API RESTful bien estructurada

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

## 📦 Instalación

### Requisitos previos
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd api-huellariosoft
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
NODE_ENV=
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
```

4. **Iniciar MongoDB**
```bash
# Si usas MongoDB local
mongod

# O usa MongoDB Atlas (cloud)
```

5. **Crear usuario administrador inicial**
```bash
node createAdmin.js
```

6. **Iniciar el servidor**

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

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

## 🔐 Roles y Permisos

- **Administrador**: Acceso completo al sistema
- **Veterinario**: Gestión de historias clínicas y citas
- **Recepcionista**: Gestión de citas, propietarios, mascotas y facturas
- **Auxiliar**: Gestión de inventario

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

## 🧪 Pruebas

Puedes probar los endpoints usando:
- **Postman** - Importa la colección
- **Thunder Client** - Extensión de VS Code
- **cURL** - Línea de comandos

### Ejemplo de login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@huellariosoft.com",
    "password": "123456Usuario"
  }'
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación stateless
- Validación de entrada en todas las rutas
- Control de acceso basado en roles
- Protección contra inyección NoSQL
- Headers de seguridad con CORS

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` o `production` |
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://localhost:27017/huellariosoft` |
| `JWT_SECRET` | Clave secreta JWT | `tu_clave_secreta` |
| `JWT_EXPIRES_IN` | Expiración del token | `15m` |
| `REFRESH_TOKEN_SECRET` | Clave refresh token | `tu_clave_refresh` |
| `REFRESH_TOKEN_EXPIRES_IN` | Expiración refresh token | `7d` |

## 📖 Documentación Adicional

- [Casos de Uso](./.github/Casos_de_uso.md)
- [Historias de Usuario](./.github/Historias_de_usuario.md)
- [Requisitos Funcionales](./.github/Requisitos_funcionales.md)
- [Requisitos No Funcionales](./.github/Requisitos_no_funcionales.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso privado para HuellarioSoft.

## 👥 Autor

**HuellarioSoft Team**