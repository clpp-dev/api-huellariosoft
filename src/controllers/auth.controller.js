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
    const { email, password } = req.body;

    const result = await authService.login(email, password);

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
    const user = await authService.getProfile(req.user._id);

    successResponse(res, user, 'Perfil obtenido exitosamente', 200);
  });

  /**
   * Logout (en el cliente se debe eliminar el token)
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    successResponse(res, null, 'Logout exitoso', 200);
  });
}

export default new AuthController();
