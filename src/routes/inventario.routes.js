import { Router } from 'express';
import inventarioController from '../controllers/inventario.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import { idValidation } from '../validators/propietario.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/inventario/search
 * @desc    Búsqueda avanzada de productos
 * @access  Private
 */
router.get('/search', inventarioController.search);

/**
 * @route   GET /api/inventario/stock-bajo
 * @desc    Obtener productos con stock bajo
 * @access  Private (Administrador, Auxiliar)
 */
router.get(
  '/stock-bajo',
  authorize('administrador', 'auxiliar'),
  inventarioController.getStockBajo
);

/**
 * @route   GET /api/inventario/estadisticas
 * @desc    Obtener estadísticas de inventario
 * @access  Private (Administrador)
 */
router.get(
  '/estadisticas',
  authorize('administrador'),
  inventarioController.getEstadisticas
);

/**
 * @route   GET /api/inventario/categoria/:categoria
 * @desc    Obtener productos por categoría
 * @access  Private
 */
router.get('/categoria/:categoria', inventarioController.getByCategoria);

/**
 * @route   GET /api/inventario
 * @desc    Obtener todos los productos
 * @access  Private
 */
router.get('/', inventarioController.getAll);

/**
 * @route   GET /api/inventario/:id
 * @desc    Obtener producto por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  inventarioController.getById
);

/**
 * @route   POST /api/inventario
 * @desc    Crear nuevo producto
 * @access  Private (Administrador, Auxiliar)
 */
router.post(
  '/',
  authorize('administrador', 'auxiliar'),
  inventarioController.create
);

/**
 * @route   PUT /api/inventario/:id
 * @desc    Actualizar producto
 * @access  Private (Administrador, Auxiliar)
 */
router.put(
  '/:id',
  authorize('administrador', 'auxiliar'),
  idValidation,
  handleValidationErrors,
  inventarioController.update
);

/**
 * @route   PATCH /api/inventario/:id/cantidad
 * @desc    Actualizar cantidad (entrada o salida)
 * @access  Private (Administrador, Auxiliar, Recepcionista)
 */
router.patch(
  '/:id/cantidad',
  authorize('administrador', 'auxiliar', 'recepcionista'),
  idValidation,
  handleValidationErrors,
  inventarioController.updateCantidad
);

/**
 * @route   DELETE /api/inventario/:id
 * @desc    Desactivar producto
 * @access  Private (Administrador)
 */
router.delete(
  '/:id',
  authorize('administrador'),
  idValidation,
  handleValidationErrors,
  inventarioController.delete
);

export default router;
