import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responses.js';

/**
 * Controller de autenticación
 */
class AuthController {
  /**
   * Login de usuario
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password, tipoUsuario } = req.body;

    const result = await authService.login(email, password, tipoUsuario);

    successResponse(res, result, 'Login exitoso', 200);
  });

  /**
   * Registro de usuario (solo administrador)
   * POST /api/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    successResponse(res, user, 'Usuario registrado exitosamente', 201);
  });

  /**
   * Refrescar token
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    successResponse(res, result, 'Token refrescado exitosamente', 200);
  });

  /**
   * Obtener perfil del usuario autenticado
   * GET /api/auth/profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id, req.user.tipoUsuario);

    successResponse(res, user, 'Perfil obtenido exitosamente', 200);
  });

  /**
   * Logout (en el cliente se debe eliminar el token)
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    successResponse(res, null, 'Logout exitoso', 200);
  });

  /**
   * Solicitar recuperación de contraseña
   * POST /api/auth/forgot-password
   * 
   * Espera a que el email se envíe antes de responder
   * - Si el email se envía exitosamente, confirma al usuario
   * - Si falla el envío, informa del error para que pueda reintentar
   * - Proporciona feedback honesto sobre el estado del proceso
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email, tipoUsuario } = req.body;

    const result = await authService.forgotPassword(email, tipoUsuario);

    successResponse(res, result, result.message, 200);
  });

  /**
   * Restablecer contraseña con token
   * POST /api/auth/reset-password
   * 
   * Intenta enviar email de confirmación pero no falla si el envío falla
   * - La contraseña se cambia exitosamente de todas formas
   * - El email de confirmación es informativo, no crítico
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(token, newPassword);

    successResponse(res, result, result.message, 200);
  });
}

export default new AuthController();
