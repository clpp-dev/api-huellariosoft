import { Router } from 'express';
import mascotaController from '../controllers/mascota.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import {
  createMascotaValidation,
  updateMascotaValidation,
  idValidation,
} from '../validators/mascota.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/mascotas/search
 * @desc    Búsqueda avanzada de mascotas
 * @access  Private
 */
router.get('/search', mascotaController.search);

/**
 * @route   GET /api/mascotas
 * @desc    Obtener todas las mascotas
 * @access  Private
 */
router.get('/', mascotaController.getAll);

/**
 * @route   GET /api/mascotas/historia/:numeroHistoriaClinica
 * @desc    Obtener mascota por número de historia clínica
 * @access  Private
 */
router.get('/historia/:numeroHistoriaClinica', mascotaController.getByHistoriaClinica);

/**
 * @route   GET /api/mascotas/propietario/:propietarioId
 * @desc    Obtener mascotas por propietario
 * @access  Private
 */
router.get('/propietario/:propietarioId', mascotaController.getByPropietario);

/**
 * @route   GET /api/mascotas/:id
 * @desc    Obtener mascota por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  mascotaController.getById
);

/**
 * @route   POST /api/mascotas
 * @desc    Crear nueva mascota
 * @access  Private (Administrador, Recepcionista)
 */
router.post(
  '/',
  authorize('administrador', 'recepcionista'),
  createMascotaValidation,
  handleValidationErrors,
  mascotaController.create
);

/**
 * @route   PUT /api/mascotas/:id
 * @desc    Actualizar mascota
 * @access  Private (Administrador, Recepcionista)
 */
router.put(
  '/:id',
  authorize('administrador', 'recepcionista'),
  updateMascotaValidation,
  handleValidationErrors,
  mascotaController.update
);

/**
 * @route   DELETE /api/mascotas/:id
 * @desc    Desactivar mascota
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  mascotaController.delete
);

export default router;
