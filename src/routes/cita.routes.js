import { Router } from 'express';
import citaController from '../controllers/cita.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import {
  createCitaValidation,
  updateCitaValidation,
  citaFiltersValidation,
  idValidation,
} from '../validators/cita.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/citas
 * @desc    Obtener todas las citas
 * @access  Private
 */
router.get(
  '/',
  citaFiltersValidation,
  handleValidationErrors,
  citaController.getAll
);

/**
 * @route   GET /api/citas/fecha/:fecha
 * @desc    Obtener citas por fecha
 * @access  Private
 */
router.get('/fecha/:fecha', citaController.getByFecha);

/**
 * @route   GET /api/citas/veterinario/:veterinarioId
 * @desc    Obtener citas por veterinario
 * @access  Private (Veterinario, Administrador, Recepcionista)
 */
router.get('/veterinario/:veterinarioId', citaController.getByVeterinario);

/**
 * @route   GET /api/citas/:id
 * @desc    Obtener cita por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  citaController.getById
);

/**
 * @route   POST /api/citas
 * @desc    Crear nueva cita
 * @access  Private (Administrador, Recepcionista)
 */
router.post(
  '/',
  authorize('administrador', 'recepcionista'),
  createCitaValidation,
  handleValidationErrors,
  citaController.create
);

/**
 * @route   PUT /api/citas/:id
 * @desc    Actualizar cita
 * @access  Private (Administrador, Recepcionista)
 */
router.put(
  '/:id',
  authorize('administrador', 'recepcionista'),
  updateCitaValidation,
  handleValidationErrors,
  citaController.update
);

/**
 * @route   PATCH /api/citas/:id/estado
 * @desc    Cambiar estado de cita
 * @access  Private (Administrador, Recepcionista, Veterinario)
 */
router.patch(
  '/:id/estado',
  authorize('administrador', 'recepcionista', 'veterinario'),
  idValidation,
  handleValidationErrors,
  citaController.updateEstado
);

/**
 * @route   PATCH /api/citas/:id/cancelar
 * @desc    Cancelar cita
 * @access  Private (Administrador, Recepcionista)
 */
router.patch(
  '/:id/cancelar',
  authorize('administrador', 'recepcionista'),
  idValidation,
  handleValidationErrors,
  citaController.cancelar
);

/**
 * @route   DELETE /api/citas/:id
 * @desc    Eliminar cita
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  citaController.delete
);

export default router;
