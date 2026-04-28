import propietarioService from '../services/propietario.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de propietarios
 */
class PropietarioController {
  /**
   * Obtener todos los propietarios
   * GET /api/propietarios
   */
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, q = '' } = req.query;

    const result = await propietarioService.getAll(
      parseInt(page),
      parseInt(limit),
      q
    );

    paginatedResponse(
      res,
      result.propietarios,
      result.pagination,
      'Propietarios obtenidos exitosamente'
    );
  });

  /**
   * Obtener propietario por ID
   * GET /api/propietarios/:id
   */
  getById = asyncHandler(async (req, res) => {
    const propietario = await propietarioService.getById(req.params.id);

    successResponse(res, propietario, 'Propietario obtenido exitosamente', 200);
  });

  /**
   * Buscar propietario por documento
   * GET /api/propietarios/documento/:documento
   */
  getByDocumento = asyncHandler(async (req, res) => {
    const propietario = await propietarioService.getByDocumento(
      req.params.documento
    );

    successResponse(res, propietario, 'Propietario encontrado exitosamente', 200);
  });

  /**
   * Crear nuevo propietario
   * POST /api/propietarios
   */
  create = asyncHandler(async (req, res) => {
    const propietario = await propietarioService.create(req.body);

    successResponse(res, propietario, 'Propietario creado exitosamente', 201);
  });

  /**
   * Actualizar propietario
   * PUT /api/propietarios/:id
   */
  update = asyncHandler(async (req, res) => {
    const propietario = await propietarioService.update(
      req.params.id,
      req.body
    );

    successResponse(
      res,
      propietario,
      'Propietario actualizado exitosamente',
      200
    );
  });

  /**
   * Desactivar propietario
   * DELETE /api/propietarios/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await propietarioService.delete(req.params.id);

    successResponse(res, result, 'Propietario desactivado exitosamente', 200);
  });

  /**
   * Búsqueda avanzada de propietarios
   * GET /api/propietarios/search
   */
  search = asyncHandler(async (req, res) => {
    const { q } = req.query;

    const propietarios = await propietarioService.search(q);

    successResponse(res, propietarios, 'Búsqueda realizada exitosamente', 200);
  });
}

export default new PropietarioController();
