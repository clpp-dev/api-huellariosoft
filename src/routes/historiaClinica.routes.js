import { Router } from 'express';
import historiaClinicaController from '../controllers/historiaClinica.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import { idValidation } from '../validators/mascota.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/historias-clinicas
 * @desc    Obtener todas las historias clínicas
 * @access  Private (Veterinario, Administrador)
 */
router.get(
  '/',
  authorize('veterinario', 'administrador'),
  historiaClinicaController.getAll
);

/**
 * @route   GET /api/historias-clinicas/mascota/:mascotaId
 * @desc    Obtener historias clínicas de una mascota
 * @access  Private
 */
router.get('/mascota/:mascotaId', historiaClinicaController.getByMascota);

/**
 * @route   GET /api/historias-clinicas/:id
 * @desc    Obtener historia clínica por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  historiaClinicaController.getById
);

/**
 * @route   POST /api/historias-clinicas
 * @desc    Crear nueva historia clínica
 * @access  Private (Veterinario)
 */
router.post(
  '/',
  authorize('veterinario'),
  historiaClinicaController.create
);

/**
 * @route   PUT /api/historias-clinicas/:id
 * @desc    Actualizar historia clínica
 * @access  Private (Veterinario)
 */
router.put(
  '/:id',
  authorize('veterinario'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.update
);

/**
 * @route   POST /api/historias-clinicas/:id/vacunas
 * @desc    Agregar vacuna
 * @access  Private (Veterinario)
 */
router.post(
  '/:id/vacunas',
  authorize('veterinario'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.addVacuna
);

/**
 * @route   POST /api/historias-clinicas/:id/cirugias
 * @desc    Agregar cirugía
 * @access  Private (Veterinario)
 */
router.post(
  '/:id/cirugias',
  authorize('veterinario'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.addCirugia
);

/**
 * @route   POST /api/historias-clinicas/:id/examenes
 * @desc    Agregar examen
 * @access  Private (Veterinario)
 */
router.post(
  '/:id/examenes',
  authorize('veterinario'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.addExamen
);

/**
 * @route   POST /api/historias-clinicas/:id/archivos
 * @desc    Agregar archivo adjunto
 * @access  Private (Veterinario)
 */
router.post(
  '/:id/archivos',
  authorize('veterinario'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.addArchivo
);

/**
 * @route   DELETE /api/historias-clinicas/:id
 * @desc    Eliminar historia clínica
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  historiaClinicaController.delete
);

export default router;
