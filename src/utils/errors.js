/**
 * Clase base para errores personalizados de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error 400 - Validación
 */
export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Error 401 - No autenticado
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado. Token inválido o expirado') {
    super(message, 401);
  }
}

/**
 * Error 403 - Sin permisos
 */
export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción') {
    super(message, 403);
  }
}

/**
 * Error 404 - No encontrado
 */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error 409 - Conflicto
 */
export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

/**
 * Error 500 - Error interno del servidor
 */
export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}
