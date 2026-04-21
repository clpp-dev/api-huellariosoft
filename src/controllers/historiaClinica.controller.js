import historiaClinicaService from '../services/historiaClinica.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de historias clínicas
 */
class HistoriaClinicaController {
  /**
   * Obtener todas las historias clínicas
   * GET /api/historias-clinicas
   */
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, mascota, veterinario } = req.query;

    const result = await historiaClinicaService.getAll(
      parseInt(page),
      parseInt(limit),
      { mascota, veterinario }
    );

    paginatedResponse(
      res,
      result.historias,
      result.pagination,
      'Historias clínicas obtenidas exitosamente'
    );
  });

  /**
   * Obtener historia clínica por ID
   * GET /api/historias-clinicas/:id
   */
  getById = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.getById(req.params.id);

    successResponse(
      res,
      historia,
      'Historia clínica obtenida exitosamente',
      200
    );
  });

  /**
   * Obtener historias clínicas de una mascota
   * GET /api/historias-clinicas/mascota/:mascotaId
   */
  getByMascota = asyncHandler(async (req, res) => {
    const historias = await historiaClinicaService.getByMascota(
      req.params.mascotaId
    );

    successResponse(
      res,
      historias,
      'Historias clínicas obtenidas exitosamente',
      200
    );
  });

  /**
   * Crear nueva historia clínica
   * POST /api/historias-clinicas
   */
  create = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.create(
      req.body,
      req.user._id
    );

    successResponse(res, historia, 'Historia clínica creada exitosamente', 201);
  });

  /**
   * Actualizar historia clínica
   * PUT /api/historias-clinicas/:id
   */
  update = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.update(
      req.params.id,
      req.body
    );

    successResponse(
      res,
      historia,
      'Historia clínica actualizada exitosamente',
      200
    );
  });

  /**
   * Agregar vacuna
   * POST /api/historias-clinicas/:id/vacunas
   */
  addVacuna = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.addVacuna(
      req.params.id,
      req.body
    );

    successResponse(res, historia, 'Vacuna agregada exitosamente', 200);
  });

  /**
   * Agregar cirugía
   * POST /api/historias-clinicas/:id/cirugias
   */
  addCirugia = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.addCirugia(
      req.params.id,
      req.body
    );

    successResponse(res, historia, 'Cirugía agregada exitosamente', 200);
  });

  /**
   * Agregar examen
   * POST /api/historias-clinicas/:id/examenes
   */
  addExamen = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.addExamen(
      req.params.id,
      req.body
    );

    successResponse(res, historia, 'Examen agregado exitosamente', 200);
  });

  /**
   * Agregar archivo adjunto
   * POST /api/historias-clinicas/:id/archivos
   */
  addArchivo = asyncHandler(async (req, res) => {
    const historia = await historiaClinicaService.addArchivo(
      req.params.id,
      req.body
    );

    successResponse(res, historia, 'Archivo agregado exitosamente', 200);
  });

  /**
   * Eliminar historia clínica
   * DELETE /api/historias-clinicas/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await historiaClinicaService.delete(req.params.id);

    successResponse(
      res,
      result,
      'Historia clínica eliminada exitosamente',
      200
    );
  });
}

export default new HistoriaClinicaController();
