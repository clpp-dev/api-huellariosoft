# 📡 Documentación de API - HuellarioSoft

## Formato de Respuesta Estándar

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo de éxito",
  "data": { /* datos de respuesta */ }
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": [ /* array de elementos */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Mensaje descriptivo del error",
  "errors": [ /* detalles del error */ ]
}
```

---

## 🔐 1. Autenticación

### 1.1 Login
Autentica un usuario y devuelve tokens de acceso.

**Endpoint:** `POST /api/auth/login`  
**Autenticación:** No requerida  
**Roles permitidos:** Público

**Request Body:**
```json
{
  "email": "admin@huellariosoft.com",
  "password": "123456Usuario"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Administrador",
      "email": "admin@huellariosoft.com",
      "rol": "administrador",
      "activo": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**
- `400` - Datos de entrada inválidos
- `401` - Credenciales incorrectas
- `403` - Usuario desactivado

---

### 1.2 Refresh Token
Renueva el access token usando el refresh token.

**Endpoint:** `POST /api/auth/refresh`  
**Autenticación:** No requerida  
**Roles permitidos:** Público

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Obtener Perfil
Obtiene información del usuario autenticado.

**Endpoint:** `GET /api/auth/profile`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Administrador",
    "email": "admin@huellariosoft.com",
    "rol": "administrador",
    "telefono": "3001234567",
    "activo": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 1.4 Logout
Cierra la sesión del usuario (el cliente debe eliminar los tokens).

**Endpoint:** `POST /api/auth/logout`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

---

## 👥 2. Usuarios

### 2.1 Listar Usuarios
Obtiene una lista paginada de usuarios del sistema.

**Endpoint:** `GET /api/users`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `rol` (opcional): Filtrar por rol
- `activo` (opcional): Filtrar por estado (true/false)

**Ejemplo:**
```
GET /api/users?page=1&limit=10&rol=veterinario&activo=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Dr. Juan García",
      "email": "juan@huellario.com",
      "rol": "veterinario",
      "telefono": "3001234567",
      "activo": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 2.2 Crear Usuario
Crea un nuevo usuario en el sistema.

**Endpoint:** `POST /api/users`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador

**Request Body:**
```json
{
  "nombre": "Dr. María López",
  "email": "maria@huellario.com",
  "password": "password123",
  "rol": "veterinario",
  "telefono": "3009876543"
}
```

**Campos:**
- `nombre` (requerido): Nombre completo
- `email` (requerido): Email único
- `password` (requerido): Contraseña (mínimo 6 caracteres)
- `rol` (requerido): administrador | veterinario | recepcionista | auxiliar
- `telefono` (opcional): Teléfono de contacto

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Dr. María López",
    "email": "maria@huellario.com",
    "rol": "veterinario",
    "telefono": "3009876543",
    "activo": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 🏠 3. Propietarios

### 3.1 Listar Propietarios
Obtiene una lista paginada de propietarios.

**Endpoint:** `GET /api/propietarios`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos los autenticados

**Query Parameters:**
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página
- `activo` (opcional): Filtrar por estado

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Propietarios obtenidos exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "nombreCompleto": "Juan Pérez González",
      "documento": "1234567890",
      "telefono": "3001112233",
      "email": "juan.perez@example.com",
      "direccion": "Calle 45 #12-34",
      "activo": true,
      "createdAt": "2024-01-10T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 3.2 Crear Propietario
Crea un nuevo propietario/cliente.

**Endpoint:** `POST /api/propietarios`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista

**Request Body:**
```json
{
  "nombreCompleto": "María Rodríguez",
  "documento": "9876543210",
  "telefono": "3009998877",
  "email": "maria.r@example.com",
  "direccion": "Carrera 30 #50-60, Apto 301"
}
```

**Campos:**
- `nombreCompleto` (requerido): Nombre completo
- `documento` (requerido): Número de documento (único)
- `telefono` (requerido): Teléfono de contacto
- `email` (opcional): Correo electrónico
- `direccion` (opcional): Dirección de residencia

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Propietario creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "nombreCompleto": "María Rodríguez",
    "documento": "9876543210",
    "telefono": "3009998877",
    "email": "maria.r@example.com",
    "direccion": "Carrera 30 #50-60, Apto 301",
    "activo": true,
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### 3.3 Buscar por Documento
Busca un propietario por número de documento.

**Endpoint:** `GET /api/propietarios/documento/:documento`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos los autenticados

**Ejemplo:**
```
GET /api/propietarios/documento/1234567890
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Propietario encontrado",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "nombreCompleto": "Juan Pérez González",
    "documento": "1234567890",
    "telefono": "3001112233",
    "email": "juan.perez@example.com",
    "direccion": "Calle 45 #12-34",
    "activo": true
  }
}
```

---

## 🐕 4. Mascotas

### 4.1 Crear Mascota
Registra una nueva mascota en el sistema.

**Endpoint:** `POST /api/mascotas`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista

**Request Body:**
```json
{
  "nombre": "Max",
  "especie": "Canino",
  "raza": "Golden Retriever",
  "sexo": "Macho",
  "edad": {
    "valor": 3,
    "unidad": "años"
  },
  "peso": 28.5,
  "color": "Dorado",
  "estadoReproductivo": "Castrado",
  "observaciones": "Alergia a pollo",
  "propietario": "507f1f77bcf86cd799439013"
}
```

**Campos de especie:** Canino | Felino | Ave | Roedor | Reptil | Otro

**Campos de sexo:** Macho | Hembra

**Campos de unidad edad:** días | meses | años

**Campos de estadoReproductivo:** Entero | Castrado | Esterilizado

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Mascota creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "nombre": "Max",
    "especie": "Canino",
    "raza": "Golden Retriever",
    "sexo": "Macho",
    "edad": {
      "valor": 3,
      "unidad": "años"
    },
    "peso": 28.5,
    "color": "Dorado",
    "estadoReproductivo": "Castrado",
    "numeroHistoriaClinica": "HC000001",
    "observaciones": "Alergia a pollo",
    "propietario": {
      "_id": "507f1f77bcf86cd799439013",
      "nombreCompleto": "Juan Pérez González",
      "telefono": "3001112233"
    },
    "activo": true,
    "createdAt": "2024-01-15T15:00:00.000Z"
  }
}
```

---

### 4.2 Obtener Mascotas por Propietario
Lista todas las mascotas de un propietario específico.

**Endpoint:** `GET /api/mascotas/propietario/:propietarioId`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos los autenticados

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mascotas obtenidas exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "nombre": "Max",
      "especie": "Canino",
      "raza": "Golden Retriever",
      "numeroHistoriaClinica": "HC000001",
      "activo": true
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "nombre": "Luna",
      "especie": "Felino",
      "raza": "Persa",
      "numeroHistoriaClinica": "HC000002",
      "activo": true
    }
  ]
}
```

---

## 📅 5. Citas

### 5.1 Crear Cita
Agenda una nueva cita veterinaria.

**Endpoint:** `POST /api/citas`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista

**Request Body:**
```json
{
  "mascota": "507f1f77bcf86cd799439015",
  "propietario": "507f1f77bcf86cd799439013",
  "veterinario": "507f1f77bcf86cd799439012",
  "fecha": "2024-01-20",
  "hora": "14:30",
  "motivo": "Consulta general y vacunación",
  "observaciones": "Primera visita del año"
}
```

**Estados posibles:** Programada | Confirmada | En_Curso | Completada | Cancelada | No_Asistio

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Cita creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "mascota": {
      "_id": "507f1f77bcf86cd799439015",
      "nombre": "Max",
      "numeroHistoriaClinica": "HC000001"
    },
    "propietario": {
      "_id": "507f1f77bcf86cd799439013",
      "nombreCompleto": "Juan Pérez González",
      "telefono": "3001112233"
    },
    "veterinario": {
      "_id": "507f1f77bcf86cd799439012",
      "nombre": "Dr. María López"
    },
    "fecha": "2024-01-20T00:00:00.000Z",
    "hora": "14:30",
    "motivo": "Consulta general y vacunación",
    "estado": "Programada",
    "observaciones": "Primera visita del año",
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

---

### 5.2 Listar Citas por Fecha
Obtiene todas las citas de una fecha específica.

**Endpoint:** `GET /api/citas/fecha/:fecha`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos los autenticados

**Ejemplo:**
```
GET /api/citas/fecha/2024-01-20
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Citas obtenidas exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "mascota": {
        "nombre": "Max",
        "numeroHistoriaClinica": "HC000001"
      },
      "propietario": {
        "nombreCompleto": "Juan Pérez González",
        "telefono": "3001112233"
      },
      "veterinario": {
        "nombre": "Dr. María López"
      },
      "fecha": "2024-01-20T00:00:00.000Z",
      "hora": "14:30",
      "motivo": "Consulta general y vacunación",
      "estado": "Programada"
    }
  ]
}
```

---

### 5.3 Cambiar Estado de Cita
Actualiza el estado de una cita.

**Endpoint:** `PATCH /api/citas/:id/estado`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista, Veterinario

**Request Body:**
```json
{
  "estado": "Confirmada"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estado de cita actualizado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "estado": "Confirmada",
    "updatedAt": "2024-01-16T09:00:00.000Z"
  }
}
```

---

## 📋 6. Historia Clínica

### 6.1 Crear Historia Clínica
Registra una nueva consulta veterinaria.

**Endpoint:** `POST /api/historias-clinicas`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Veterinario

**Request Body:**
```json
{
  "mascota": "507f1f77bcf86cd799439015",
  "cita": "507f1f77bcf86cd799439017",
  "veterinario": "507f1f77bcf86cd799439012",
  "fechaConsulta": "2024-01-20T14:30:00.000Z",
  "motivoConsulta": "Consulta general y vacunación",
  "sintomas": "Ninguno, revisión de rutina",
  "diagnostico": "Paciente sano, desarrollo normal",
  "tratamiento": "Vacuna antirrábica aplicada",
  "peso": 28.5,
  "temperatura": 38.5,
  "frecuenciaCardiaca": 95,
  "frecuenciaRespiratoria": 25,
  "vacunas": [
    {
      "nombre": "Antirrábica",
      "fecha": "2024-01-20",
      "proximaDosis": "2025-01-20",
      "lote": "VAC2024001"
    }
  ],
  "observaciones": "Paciente en excelentes condiciones"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Historia clínica creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "mascota": {
      "_id": "507f1f77bcf86cd799439015",
      "nombre": "Max",
      "numeroHistoriaClinica": "HC000001"
    },
    "veterinario": {
      "_id": "507f1f77bcf86cd799439012",
      "nombre": "Dr. María López"
    },
    "fechaConsulta": "2024-01-20T14:30:00.000Z",
    "motivoConsulta": "Consulta general y vacunación",
    "diagnostico": "Paciente sano, desarrollo normal",
    "peso": 28.5,
    "temperatura": 38.5,
    "vacunas": [
      {
        "nombre": "Antirrábica",
        "fecha": "2024-01-20T00:00:00.000Z",
        "proximaDosis": "2025-01-20T00:00:00.000Z",
        "lote": "VAC2024001"
      }
    ],
    "createdAt": "2024-01-20T15:00:00.000Z"
  }
}
```

---

### 6.2 Obtener Historias de una Mascota
Lista todas las historias clínicas de una mascota específica.

**Endpoint:** `GET /api/historias-clinicas/mascota/:mascotaId`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Todos los autenticados

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Historias clínicas obtenidas exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "fechaConsulta": "2024-01-20T14:30:00.000Z",
      "veterinario": {
        "nombre": "Dr. María López"
      },
      "motivoConsulta": "Consulta general y vacunación",
      "diagnostico": "Paciente sano",
      "peso": 28.5
    }
  ]
}
```

---

## 📦 7. Inventario

### 7.1 Crear Producto
Registra un nuevo producto en el inventario.

**Endpoint:** `POST /api/inventario`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Auxiliar

**Request Body:**
```json
{
  "nombre": "Amoxicilina 500mg",
  "categoria": "Medicamento",
  "descripcion": "Antibiótico de amplio espectro",
  "cantidad": 50,
  "stockMinimo": 10,
  "unidadMedida": "Tabletas",
  "precioCompra": 15000,
  "precioVenta": 25000,
  "proveedor": "Droguería VetPharma",
  "fechaVencimiento": "2025-12-31",
  "lote": "LOT2024001"
}
```

**Categorías:** Medicamento | Vacuna | Alimento | Accesorio | Instrumental | Quirúrgico | Otro

**Unidades:** Unidades | Gramos | Kilogramos | Mililitros | Litros | Tabletas | Cápsulas | Otro

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "nombre": "Amoxicilina 500mg",
    "categoria": "Medicamento",
    "descripcion": "Antibiótico de amplio espectro",
    "cantidad": 50,
    "stockMinimo": 10,
    "stockBajo": false,
    "unidadMedida": "Tabletas",
    "precioCompra": 15000,
    "precioVenta": 25000,
    "proveedor": "Droguería VetPharma",
    "fechaVencimiento": "2025-12-31T00:00:00.000Z",
    "lote": "LOT2024001",
    "activo": true,
    "createdAt": "2024-01-15T17:00:00.000Z"
  }
}
```

---

### 7.2 Obtener Stock Bajo
Lista productos con cantidad menor o igual al stock mínimo.

**Endpoint:** `GET /api/inventario/stock-bajo`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Auxiliar

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Productos con stock bajo obtenidos exitosamente",
  "data": [
    {
      "_id": "507f1f77bcf86cd79943901a",
      "nombre": "Ivermectina 10ml",
      "categoria": "Medicamento",
      "cantidad": 5,
      "stockMinimo": 10,
      "stockBajo": true,
      "unidadMedida": "Unidades"
    }
  ]
}
```

---

### 7.3 Actualizar Cantidad
Registra entrada o salida de producto.

**Endpoint:** `PATCH /api/inventario/:id/cantidad`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Auxiliar, Recepcionista

**Request Body:**
```json
{
  "cantidad": 20,
  "tipo": "entrada"
}
```

**Tipos:** entrada | salida

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cantidad actualizada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "nombre": "Amoxicilina 500mg",
    "cantidad": 70,
    "stockBajo": false
  }
}
```

---

## 💰 8. Facturas

### 8.1 Crear Factura
Genera una nueva factura de venta.

**Endpoint:** `POST /api/facturas`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista

**Request Body:**
```json
{
  "propietario": "507f1f77bcf86cd799439013",
  "mascota": "507f1f77bcf86cd799439015",
  "servicios": [
    {
      "tipo": "consulta",
      "descripcion": "Consulta general",
      "cantidad": 1,
      "precioUnitario": 50000
    },
    {
      "tipo": "medicamento",
      "descripcion": "Amoxicilina 500mg x 10",
      "cantidad": 10,
      "precioUnitario": 2500
    }
  ],
  "impuestos": 5000,
  "descuento": 0,
  "metodoPago": "Efectivo",
  "observaciones": "Pago completo"
}
```

**Tipos de servicio:** consulta | medicamento | vacuna | cirugia | examen | hospitalizacion | otro

**Métodos de pago:** Efectivo | Tarjeta | Transferencia | Otro

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd79943901b",
    "numeroFactura": "FAC00000001",
    "propietario": {
      "_id": "507f1f77bcf86cd799439013",
      "nombreCompleto": "Juan Pérez González"
    },
    "mascota": {
      "_id": "507f1f77bcf86cd799439015",
      "nombre": "Max"
    },
    "servicios": [
      {
        "tipo": "consulta",
        "descripcion": "Consulta general",
        "cantidad": 1,
        "precioUnitario": 50000,
        "subtotal": 50000
      },
      {
        "tipo": "medicamento",
        "descripcion": "Amoxicilina 500mg x 10",
        "cantidad": 10,
        "precioUnitario": 2500,
        "subtotal": 25000
      }
    ],
    "subtotal": 75000,
    "impuestos": 5000,
    "descuento": 0,
    "total": 80000,
    "estado": "Pagada",
    "metodoPago": "Efectivo",
    "fechaPago": "2024-01-20T16:00:00.000Z",
    "createdAt": "2024-01-20T16:00:00.000Z"
  }
}
```

---

### 8.2 Marcar como Pagada
Actualiza el estado de una factura pendiente a pagada.

**Endpoint:** `PATCH /api/facturas/:id/pagar`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador, Recepcionista

**Request Body:**
```json
{
  "metodoPago": "Tarjeta"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Factura marcada como pagada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd79943901b",
    "numeroFactura": "FAC00000001",
    "estado": "Pagada",
    "metodoPago": "Tarjeta",
    "fechaPago": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 8.3 Obtener Estadísticas
Obtiene estadísticas de facturación por rango de fechas.

**Endpoint:** `GET /api/facturas/estadisticas`  
**Autenticación:** Bearer Token  
**Roles permitidos:** Administrador

**Query Parameters:**
- `fechaInicio` (opcional): Fecha inicio (formato: YYYY-MM-DD)
- `fechaFin` (opcional): Fecha fin (formato: YYYY-MM-DD)

**Ejemplo:**
```
GET /api/facturas/estadisticas?fechaInicio=2024-01-01&fechaFin=2024-01-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "totalFacturado": 2500000,
    "totalPagado": 2300000,
    "totalPendiente": 200000,
    "cantidadFacturas": 45,
    "facturasPagadas": 42,
    "facturasPendientes": 3,
    "facturasAnuladas": 0,
    "promedioFactura": 55555.56
  }
}
```

---

## 🔒 Códigos de Estado HTTP

- `200` - OK: Petición exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Datos de entrada inválidos
- `401` - Unauthorized: No autenticado o token inválido
- `403` - Forbidden: Sin permisos para acceder al recurso
- `404` - Not Found: Recurso no encontrado
- `409` - Conflict: Conflicto con el estado actual (ej: documento duplicado)
- `500` - Internal Server Error: Error interno del servidor

---

## 🔑 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer <tu_access_token>
```

Los tokens tienen una duración de 15 minutos. Usa el refresh token para obtener un nuevo access token sin requerir login.

---

## 📝 Notas Adicionales

1. **Paginación**: Todos los endpoints de listado soportan paginación con `page` y `limit`
2. **Búsqueda**: Los endpoints de búsqueda suelen soportar búsqueda por texto con el parámetro `q`
3. **Filtros**: La mayoría de endpoints soportan filtros específicos según el recurso
4. **Poblado**: Las respuestas incluyen referencias pobladas automáticamente cuando es relevante
5. **Validación**: Todos los endpoints validan los datos de entrada y retornan errores descriptivos

---

**Versión de API:** 1.0.0  
**Última actualización:** Enero 2024
