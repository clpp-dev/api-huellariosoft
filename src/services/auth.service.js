import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/config.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';

/**
 * Servicio de autenticación
 * Maneja login, registro y generación de tokens
 */
class AuthService {
  /**
   * Login de usuario
   */
  async login(email, password) {
    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      throw new UnauthorizedError('Usuario desactivado');
    }

    // Comparar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Retornar usuario sin password
    const userResponse = user.toJSON();

    return {
      user: userResponse,
      token,
      refreshToken,
    };
  }

  /**
   * Registro de nuevo usuario (solo administrador puede registrar)
   */
  async register(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    // Crear usuario
    const user = await User.create(userData);

    // Retornar usuario sin password
    return user.toJSON();
  }

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken) {
    try {
      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

      // Buscar usuario
      const user = await User.findById(decoded.userId);

      if (!user || !user.activo) {
        throw new UnauthorizedError('Usuario no encontrado o desactivado');
      }

      // Generar nuevo token de acceso
      const newToken = this.generateToken(user);

      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedError('Refresh token inválido o expirado');
    }
  }

  /**
   * Obtener perfil de usuario
   */
  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Generar token de acceso JWT
   */
  generateToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        rol: user.rol,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );
  }

  /**
   * Generar refresh token JWT
   */
  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user._id,
      },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
      }
    );
  }
}

export default new AuthService();
