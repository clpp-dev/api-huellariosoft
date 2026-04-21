import { AppError, ValidationError } from '../utils/errors.js';
import { config } from '../config/config.js';

/**
 * Middleware global de manejo de errores
 * Debe ser el último middleware en la cadena
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error
  console.error('❌ Error:', {
    message: err.message,
    stack: config.env === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });

  // Errores de aplicación personalizados
  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
      status: err.status,
    };

    // Incluir errores de validación si existen
    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors,
    });
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `El ${field} ya existe`,
    });
  }

  // Error de cast de MongoDB (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
  }

  // Error por defecto (500)
  res.status(500).json({
    success: false,
    message:
      config.env === 'production'
        ? 'Error interno del servidor'
        : err.message,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};
