import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import {
  registerUserValidation,
  updateUserValidation,
  idValidation,
} from '../validators/auth.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Private (Administrador)
 */
router.get('/', authorize('administrador'), userController.getAll);

/**
 * @route   GET /api/users/role/:rol
 * @desc    Obtener usuarios por rol
 * @access  Private (Administrador, Recepcionista, Auxiliar, Veterinario, Propietario)
 */
router.get(
  '/role/:rol',
  authorize('administrador', 'recepcionista', 'auxiliar', 'veterinario', 'propietario'),
  userController.getByRole
);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Private (Administrador)
 */
router.get(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  userController.getById
);

/**
 * @route   POST /api/users
 * @desc    Crear nuevo usuario
 * @access  Private (Administrador)
 */
router.post(
  '/',
  authorize('administrador'),
  registerUserValidation,
  handleValidationErrors,
  userController.create
);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private (Administrador)
 */
router.put(
  '/:id',
  authorize('administrador'),
  updateUserValidation,
  handleValidationErrors,
  userController.update
);

/**
 * @route   PATCH /api/users/:id/deactivate
 * @desc    Desactivar usuario
 * @access  Private (Administrador)
 */
router.patch(
  '/:id/deactivate',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  userController.deactivate
);

/**
 * @route   PATCH /api/users/:id/activate
 * @desc    Activar usuario
 * @access  Private (Administrador)
 */
router.patch(
  '/:id/activate',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  userController.activate
);

/**
 * @route   PATCH /api/users/:id/toggle-status
 * @desc    Toggle status del usuario (activar/desactivar)
 * @access  Private (Administrador)
 */
router.patch(
  '/:id/toggle-status',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  userController.toggleStatus
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario permanentemente
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  userController.delete
);

export default router;
