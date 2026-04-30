import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Propietario } from '../models/Propietario.js';
import { config } from '../config/config.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';
import emailService from './email.service.js';

/**
 * Servicio de autenticación
 * Maneja login, registro y generación de tokens
 */
class AuthService {
  /**
   * Login de usuario (empleados y propietarios)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {string} tipoUsuario - 'empleado' o 'propietario'
   */
  async login(email, password, tipoUsuario = 'empleado') {
    let user;
    let userType;

    if (tipoUsuario === 'propietario') {
      // Buscar propietario con password
      user = await Propietario.findOne({ email }).select('+password');
      userType = 'propietario';

      if (!user) {
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Verificar si el propietario está activo
      if (!user.activo) {
        throw new UnauthorizedError('Cuenta desactivada');
      }
    } else {
      // Buscar empleado con password
      user = await User.findOne({ email }).select('+password');
      userType = 'empleado';

      if (!user) {
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        throw new UnauthorizedError('Usuario desactivado');
      }
    }

    // Comparar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar tokens
    const token = this.generateToken(user, userType);
    const refreshToken = this.generateRefreshToken(user, userType);

    // Retornar usuario sin password
    const userResponse = user.toJSON();

    return {
      user: { ...userResponse, tipoUsuario: userType },
      token,
      refreshToken,
      tipoUsuario: userType,
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

      const tipoUsuario = decoded.tipoUsuario || 'empleado';
      let user;

      if (tipoUsuario === 'propietario') {
        user = await Propietario.findById(decoded.userId);
      } else {
        user = await User.findById(decoded.userId);
      }

      if (!user || !user.activo) {
        throw new UnauthorizedError('Usuario no encontrado o desactivado');
      }

      // Generar nuevo token de acceso
      const newToken = this.generateToken(user, tipoUsuario);

      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedError('Refresh token inválido o expirado');
    }
  }

  /**
   * Obtener perfil de usuario o propietario
   */
  async getProfile(userId, tipoUsuario = 'empleado') {
    let user;

    if (tipoUsuario === 'propietario') {
      user = await Propietario.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return { ...user.toJSON(), tipoUsuario };
  }

  /**
   * Generar token de acceso JWT
   */
  generateToken(user, tipoUsuario = 'empleado') {
    const payload = {
      userId: user._id,
      email: user.email,
      tipoUsuario,
    };

    // Solo empleados tienen rol
    if (tipoUsuario === 'empleado') {
      payload.rol = user.rol;
    }

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Generar refresh token JWT
   */
  generateRefreshToken(user, tipoUsuario = 'empleado') {
    return jwt.sign(
      {
        userId: user._id,
        tipoUsuario,
      },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
      }
    );
  }

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @param {string} tipoUsuario - 'empleado' o 'propietario'
   */
  async forgotPassword(email, tipoUsuario = 'empleado') {
    let user;
    let userName;

    // Buscar usuario según tipo
    if (tipoUsuario === 'propietario') {
      user = await Propietario.findOne({ email });
      userName = user?.nombreCompleto || 'Usuario';
    } else {
      user = await User.findOne({ email });
      userName = user?.nombre || 'Usuario';
    }

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return {
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña',
      };
    }

    if (!user.activo) {
      throw new UnauthorizedError('Cuenta desactivada');
    }

    // Generar token de reseteo (32 bytes hexadecimales)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hashear token antes de guardarlo (por seguridad)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Guardar token hasheado y fecha de expiración (1 hora)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar email con token sin hashear (el que se enviará en la URL)
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, userName);
    } catch (error) {
      // Si falla el envío, limpiar token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar el correo de recuperación');
    }

    return {
      success: true,
      message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña',
    };
  }

  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de reseteo
   * @param {string} newPassword - Nueva contraseña
   */
  async resetPassword(token, newPassword) {
    // Hashear token recibido para comparar
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario en empleados
    let user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    let tipoUsuario = 'empleado';
    let userName;

    // Si no se encuentra en empleados, buscar en propietarios
    if (!user) {
      user = await Propietario.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+resetPasswordToken +resetPasswordExpires');
      
      tipoUsuario = 'propietario';
    }

    if (!user) {
      throw new UnauthorizedError('Token inválido o expirado');
    }

    // Actualizar contraseña
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Nombre para el email
    userName = tipoUsuario === 'propietario' ? user.nombreCompleto : user.nombre;

    // Enviar email de confirmación
    try {
      await emailService.sendPasswordChangedEmail(user.email, userName);
    } catch (error) {
      console.error('Error al enviar email de confirmación:', error);
      // No lanzar error, la contraseña ya se cambió exitosamente
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }
}

export default new AuthService();
