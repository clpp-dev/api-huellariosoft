import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Propietario } from '../models/Propietario.js';
import { config } from '../config/config.js';
import { UnauthorizedError, ConflictError, NotFoundError, ValidationError, InternalServerError } from '../utils/errors.js';
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

    // Buscar usuario según tipo seleccionado
    if (tipoUsuario === 'propietario') {
      user = await Propietario.findOne({ email }).select('nombreCompleto activo email').lean();
      userName = user?.nombreCompleto || 'Usuario';
    } else {
      user = await User.findOne({ email }).select('nombre activo email').lean();
      userName = user?.nombre || 'Usuario';
    }

    // Si no existe el usuario, verificar si existe en la tabla opuesta
    if (!user) {
      let userInOppositeTable;
      
      if (tipoUsuario === 'propietario') {
        // Buscó en Propietario pero no encontró, verificar en User
        userInOppositeTable = await User.findOne({ email }).select('email').lean();
        if (userInOppositeTable) {
          throw new ValidationError('Este correo está registrado como empleado. Por favor selecciona "Empleado" como tipo de usuario e intenta nuevamente.');
        }
      } else {
        // Buscó en User pero no encontró, verificar en Propietario
        userInOppositeTable = await Propietario.findOne({ email }).select('email').lean();
        if (userInOppositeTable) {
          throw new ValidationError('Este correo está registrado como propietario. Por favor selecciona "Propietario" como tipo de usuario e intenta nuevamente.');
        }
      }
      
      // No existe en ninguna tabla, responder con mensaje genérico por seguridad
      return {
        success: true,
        message: 'Si el correo existe en el sistema, recibirás instrucciones para restablecer tu contraseña',
      };
    }

    // Si el usuario existe pero está inactivo
    if (!user.activo) {
      return {
        success: true,
        message: 'Si el correo existe en el sistema, recibirás instrucciones para restablecer tu contraseña',
      };
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

    // Intentar enviar el email y esperar el resultado
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, userName);
      console.log(`✅ Email de recuperación enviado exitosamente a: ${email}`);
      
      return {
        success: true,
        message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
      };
    } catch (emailError) {
      console.error(`❌ Error al enviar email a ${email}:`, emailError.message);
      
      // Limpiar el token si falló el envío del email
      const clearTokenQuery = {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      };
      
      if (tipoUsuario === 'propietario') {
        await Propietario.findByIdAndUpdate(user._id, clearTokenQuery);
      } else {
        await User.findByIdAndUpdate(user._id, clearTokenQuery);
      }
      
      // Ser honesto con el usuario sobre el fallo
      throw new InternalServerError('No se pudo enviar el correo de recuperación. Por favor, intenta nuevamente o contacta al administrador');
    }
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

    // Intentar enviar email de confirmación (no crítico si falla)
    try {
      await emailService.sendPasswordChangedEmail(userEmail, userName);
      console.log(`✅ Email de confirmación enviado a: ${userEmail}`);
    } catch (error) {
      // Loguear el error pero no fallar - la contraseña ya fue cambiada exitosamente
      console.error(`❌ Error al enviar email de confirmación a ${userEmail}:`, error.message);
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }

  /**
   * Cambiar contraseña del usuario autenticado
   * @param {string} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @param {string} tipoUsuario - 'empleado' o 'propietario'
   */
  async changePassword(userId, currentPassword, newPassword, tipoUsuario = 'empleado') {
    let user;

    // Buscar usuario según tipo
    if (tipoUsuario === 'propietario') {
      user = await Propietario.findById(userId).select('+password email nombreCompleto');
    } else {
      user = await User.findById(userId).select('+password email nombre');
    }

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedError('La contraseña actual es incorrecta');
    }

    // Actualizar a la nueva contraseña
    user.password = newPassword;
    await user.save();

    // Enviar email de confirmación (no crítico si falla)
    try {
      const userName = tipoUsuario === 'propietario' ? user.nombreCompleto : user.nombre;
      await emailService.sendPasswordChangedEmail(user.email, userName);
      console.log(`✅ Email de confirmación de cambio de contraseña enviado a: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error al enviar email de confirmación a ${user.email}:`, error.message);
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }
}

export default new AuthService();
