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

    // Buscar usuario según tipo (solo campos necesarios para optimizar)
    if (tipoUsuario === 'propietario') {
      user = await Propietario.findOne({ email }).select('nombreCompleto activo email').lean();
      userName = user?.nombreCompleto || 'Usuario';
    } else {
      user = await User.findOne({ email }).select('nombre activo email').lean();
      userName = user?.nombre || 'Usuario';
    }

    // Siempre responder lo mismo por seguridad (no revelar si existe el email)
    const response = {
      success: true,
      message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña',
    };

    // Si no existe el usuario o está inactivo, responder inmediatamente sin hacer nada más
    if (!user || !user.activo) {
      return response;
    }

    // Generar token de reseteo (32 bytes hexadecimales)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hashear token antes de guardarlo (por seguridad)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Actualizar token de forma optimizada (sin cargar todo el documento)
    const updateQuery = {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000, // 1 hora
    };

    if (tipoUsuario === 'propietario') {
      await Propietario.findByIdAndUpdate(user._id, updateQuery);
    } else {
      await User.findByIdAndUpdate(user._id, updateQuery);
    }

    // OPTIMIZACIÓN CRÍTICA: Enviar email de forma ASÍNCRONA sin bloquear la respuesta
    // Esto permite responder al cliente inmediatamente
    emailService.sendPasswordResetEmail(email, resetToken, userName)
      .then(() => {
        console.log(`✅ Email de recuperación enviado a: ${email}`);
      })
      .catch((error) => {
        console.error(`❌ Error al enviar email a ${email}:`, error.message);
        // En un servidor de producción, aquí podrías agregar el email a una cola de reintentos
      });

    // Responder inmediatamente sin esperar el email
    return response;
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

    // Buscar usuario en empleados (solo campos necesarios)
    let user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires password nombre email');

    let tipoUsuario = 'empleado';
    let userName;

    // Si no se encuentra en empleados, buscar en propietarios
    if (!user) {
      user = await Propietario.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+resetPasswordToken +resetPasswordExpires password nombreCompleto email');
      
      tipoUsuario = 'propietario';
    }

    if (!user) {
      throw new UnauthorizedError('Token inválido o expirado');
    }

    // Guardar email y nombre antes de actualizar
    const userEmail = user.email;
    userName = tipoUsuario === 'propietario' ? user.nombreCompleto : user.nombre;

    // Actualizar contraseña
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // OPTIMIZACIÓN: Enviar email de confirmación de forma ASÍNCRONA
    // No esperamos a que se envíe para responder al cliente
    emailService.sendPasswordChangedEmail(userEmail, userName)
      .then(() => {
        console.log(`✅ Email de confirmación enviado a: ${userEmail}`);
      })
      .catch((error) => {
        console.error(`❌ Error al enviar email de confirmación a ${userEmail}:`, error.message);
        // No afecta el cambio de contraseña que ya se completó
      });

    // Responder inmediatamente
    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }
}

export default new AuthService();
