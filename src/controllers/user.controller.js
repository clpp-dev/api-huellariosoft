import userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de usuarios
 */
class UserController {
  /**
   * Obtener todos los usuarios
   * GET /api/users
   */
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, rol, activo, search } = req.query;

    const result = await userService.getAll(
      parseInt(page),
      parseInt(limit),
      { rol, activo, search }
    );

    paginatedResponse(
      res,
      result.users,
      result.pagination,
      'Usuarios obtenidos exitosamente'
    );
  });

  /**
   * Obtener usuario por ID
   * GET /api/users/:id
   */
  getById = asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);

    successResponse(res, user, 'Usuario obtenido exitosamente', 200);
  });

  /**
   * Crear nuevo usuario
   * POST /api/users
   */
  create = asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);

    successResponse(res, user, 'Usuario creado exitosamente', 201);
  });

  /**
   * Actualizar usuario
   * PUT /api/users/:id
   */
  update = asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);

    successResponse(res, user, 'Usuario actualizado exitosamente', 200);
  });

  /**
   * Desactivar usuario
   * PATCH /api/users/:id/deactivate
   */
  deactivate = asyncHandler(async (req, res) => {
    const user = await userService.deactivate(req.params.id);

    successResponse(res, user, 'Usuario desactivado exitosamente', 200);
  });

  /**
   * Activar usuario
   * PATCH /api/users/:id/activate
   */
  activate = asyncHandler(async (req, res) => {
    const user = await userService.activate(req.params.id);

    successResponse(res, user, 'Usuario activado exitosamente', 200);
  });

  /**
   * Eliminar usuario permanentemente
   * DELETE /api/users/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await userService.delete(req.params.id);

    successResponse(res, result, 'Usuario eliminado exitosamente', 200);
  });

  /**
   * Obtener usuarios por rol
   * GET /api/users/role/:rol
   */
  getByRole = asyncHandler(async (req, res) => {
    const users = await userService.getByRole(req.params.rol);

    successResponse(res, users, 'Usuarios obtenidos exitosamente', 200);
  });

  /**
   * Toggle status del usuario (activar/desactivar)
   * PATCH /api/users/:id/toggle-status
   */
  toggleStatus = asyncHandler(async (req, res) => {
    const user = await userService.toggleStatus(req.params.id);

    successResponse(
      res,
      user,
      `Usuario ${user.activo ? 'activado' : 'desactivado'} exitosamente`,
      200
    );
  });
}

export default new UserController();
