import mascotaService from '../services/mascota.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de mascotas
 */
class MascotaController {
  /**
   * Obtener todas las mascotas
   * GET /api/mascotas
   */
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, propietario, especie, search } = req.query;

    const result = await mascotaService.getAll(
      parseInt(page),
      parseInt(limit),
      { propietario, especie, search }
    );

    paginatedResponse(
      res,
      result.mascotas,
      result.pagination,
      'Mascotas obtenidas exitosamente'
    );
  });

  /**
   * Obtener mascota por ID
   * GET /api/mascotas/:id
   */
  getById = asyncHandler(async (req, res) => {
    const mascota = await mascotaService.getById(req.params.id);

    successResponse(res, mascota, 'Mascota obtenida exitosamente', 200);
  });

  /**
   * Obtener mascota por número de historia clínica
   * GET /api/mascotas/historia/:numeroHistoriaClinica
   */
  getByHistoriaClinica = asyncHandler(async (req, res) => {
    const mascota = await mascotaService.getByHistoriaClinica(
      req.params.numeroHistoriaClinica
    );

    successResponse(res, mascota, 'Mascota encontrada exitosamente', 200);
  });

  /**
   * Obtener mascotas por propietario
   * GET /api/mascotas/propietario/:propietarioId
   */
  getByPropietario = asyncHandler(async (req, res) => {
    const mascotas = await mascotaService.getByPropietario(
      req.params.propietarioId
    );

    successResponse(res, mascotas, 'Mascotas obtenidas exitosamente', 200);
  });

  /**
   * Crear nueva mascota
   * POST /api/mascotas
   */
  create = asyncHandler(async (req, res) => {
    const mascota = await mascotaService.create(req.body);

    successResponse(res, mascota, 'Mascota creada exitosamente', 201);
  });

  /**
   * Actualizar mascota
   * PUT /api/mascotas/:id
   */
  update = asyncHandler(async (req, res) => {
    const mascota = await mascotaService.update(req.params.id, req.body);

    successResponse(res, mascota, 'Mascota actualizada exitosamente', 200);
  });

  /**
   * Desactivar mascota
   * DELETE /api/mascotas/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await mascotaService.delete(req.params.id);

    successResponse(res, result, 'Mascota desactivada exitosamente', 200);
  });

  /**
   * Búsqueda avanzada de mascotas
   * GET /api/mascotas/search
   */
  search = asyncHandler(async (req, res) => {
    const { q } = req.query;

    const mascotas = await mascotaService.search(q);

    successResponse(res, mascotas, 'Búsqueda realizada exitosamente', 200);
  });
}

export default new MascotaController();
