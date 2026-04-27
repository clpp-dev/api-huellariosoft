import citaService from '../services/cita.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de citas
 */
class CitaController {
  /**
   * Obtener todas las citas
   * GET /api/citas
   */
  getAll = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      fecha,
      veterinario,
      mascota,
      propietario,
      estado,
      q,
    } = req.query;

    const result = await citaService.getAll(parseInt(page), parseInt(limit), {
      fecha,
      veterinario,
      mascota,
      propietario,
      estado,
      q,
    });

    paginatedResponse(
      res,
      result.citas,
      result.pagination,
      'Citas obtenidas exitosamente'
    );
  });

  /**
   * Obtener cita por ID
   * GET /api/citas/:id
   */
  getById = asyncHandler(async (req, res) => {
    const cita = await citaService.getById(req.params.id);

    successResponse(res, cita, 'Cita obtenida exitosamente', 200);
  });

  /**
   * Obtener citas por fecha
   * GET /api/citas/fecha/:fecha
   */
  getByFecha = asyncHandler(async (req, res) => {
    const citas = await citaService.getByFecha(req.params.fecha);

    successResponse(res, citas, 'Citas obtenidas exitosamente', 200);
  });

  /**
   * Obtener citas por veterinario
   * GET /api/citas/veterinario/:veterinarioId
   */
  getByVeterinario = asyncHandler(async (req, res) => {
    const { fecha } = req.query;
    const citas = await citaService.getByVeterinario(
      req.params.veterinarioId,
      fecha
    );

    successResponse(res, citas, 'Citas obtenidas exitosamente', 200);
  });

  /**
   * Crear nueva cita
   * POST /api/citas
   */
  create = asyncHandler(async (req, res) => {
    const cita = await citaService.create(req.body, req.user._id);

    successResponse(res, cita, 'Cita creada exitosamente', 201);
  });

  /**
   * Actualizar cita
   * PUT /api/citas/:id
   */
  update = asyncHandler(async (req, res) => {
    const cita = await citaService.update(req.params.id, req.body);

    successResponse(res, cita, 'Cita actualizada exitosamente', 200);
  });

  /**
   * Cambiar estado de cita
   * PATCH /api/citas/:id/estado
   */
  updateEstado = asyncHandler(async (req, res) => {
    const { estado } = req.body;
    const cita = await citaService.updateEstado(req.params.id, estado);

    successResponse(res, cita, 'Estado de cita actualizado exitosamente', 200);
  });

  /**
   * Cancelar cita
   * PATCH /api/citas/:id/cancelar
   */
  cancelar = asyncHandler(async (req, res) => {
    const cita = await citaService.cancelar(req.params.id);

    successResponse(res, cita, 'Cita cancelada exitosamente', 200);
  });

  /**
   * Eliminar cita
   * DELETE /api/citas/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await citaService.delete(req.params.id);

    successResponse(res, result, 'Cita eliminada exitosamente', 200);
  });
}

export default new CitaController();
