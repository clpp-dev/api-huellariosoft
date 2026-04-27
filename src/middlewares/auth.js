import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { User } from '../models/User.js';

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario al request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    if (!user.activo) {
      throw new UnauthorizedError('Usuario desactivado');
    }

    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expirado'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (!roles.includes(req.user.rol)) {
      return next(
        new ForbiddenError(
          `El rol '${req.user.rol}' no tiene permisos para esta acción. Se requiere: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};
