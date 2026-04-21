import { Router } from 'express';
import propietarioController from '../controllers/propietario.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import {
  createPropietarioValidation,
  updatePropietarioValidation,
  idValidation,
  searchValidation,
} from '../validators/propietario.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/propietarios/search
 * @desc    Búsqueda avanzada de propietarios
 * @access  Private
 */
router.get(
  '/search',
  searchValidation,
  handleValidationErrors,
  propietarioController.search
);

/**
 * @route   GET /api/propietarios
 * @desc    Obtener todos los propietarios
 * @access  Private
 */
router.get('/', propietarioController.getAll);

/**
 * @route   GET /api/propietarios/documento/:documento
 * @desc    Buscar propietario por documento
 * @access  Private
 */
router.get('/documento/:documento', propietarioController.getByDocumento);

/**
 * @route   GET /api/propietarios/:id
 * @desc    Obtener propietario por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  propietarioController.getById
);

/**
 * @route   POST /api/propietarios
 * @desc    Crear nuevo propietario
 * @access  Private (Administrador, Recepcionista)
 */
router.post(
  '/',
  authorize('administrador', 'recepcionista'),
  createPropietarioValidation,
  handleValidationErrors,
  propietarioController.create
);

/**
 * @route   PUT /api/propietarios/:id
 * @desc    Actualizar propietario
 * @access  Private (Administrador, Recepcionista)
 */
router.put(
  '/:id',
  authorize('administrador', 'recepcionista'),
  updatePropietarioValidation,
  handleValidationErrors,
  propietarioController.update
);

/**
 * @route   DELETE /api/propietarios/:id
 * @desc    Desactivar propietario
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  propietarioController.delete
);

export default router;
