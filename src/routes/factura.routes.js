import { Router } from 'express';
import facturaController from '../controllers/factura.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import { idValidation } from '../validators/propietario.validator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/facturas/estadisticas
 * @desc    Obtener estadísticas de facturación
 * @access  Private (Administrador, Veterinario)
 */
router.get(
  '/estadisticas',
  authorize('administrador', 'veterinario'),
  facturaController.getEstadisticas
);

/**
 * @route   GET /api/facturas
 * @desc    Obtener todas las facturas
 * @access  Private (Administrador, Veterinario, Recepcionista, Auxiliar)
 */
router.get(
  '/',
  authorize('administrador', 'veterinario', 'recepcionista', 'auxiliar'),
  facturaController.getAll
);

/**
 * @route   GET /api/facturas/numero/:numeroFactura
 * @desc    Obtener factura por número
 * @access  Private
 */
router.get('/numero/:numeroFactura', facturaController.getByNumero);

/**
 * @route   GET /api/facturas/propietario/:propietarioId
 * @desc    Obtener facturas por propietario
 * @access  Private
 */
router.get('/propietario/:propietarioId', facturaController.getByPropietario);

/**
 * @route   GET /api/facturas/:id/pdf
 * @desc    Generar PDF de factura
 * @access  Private
 */
router.get('/:id/pdf', facturaController.generatePDF);

/**
 * @route   GET /api/facturas/:id
 * @desc    Obtener factura por ID
 * @access  Private
 */
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  facturaController.getById
);

/**
 * @route   POST /api/facturas
 * @desc    Crear nueva factura
 * @access  Private (Administrador, Veterinario, Recepcionista, Auxiliar)
 */
router.post(
  '/',
  authorize('administrador', 'veterinario', 'recepcionista', 'auxiliar'),
  facturaController.create
);

/**
 * @route   PUT /api/facturas/:id
 * @desc    Actualizar factura
 * @access  Private (Administrador, Veterinario)
 */
router.put(
  '/:id',
  authorize('administrador', 'veterinario'),
  idValidation,
  handleValidationErrors,
  facturaController.update
);

/**
 * @route   PATCH /api/facturas/:id/pagar
 * @desc    Marcar factura como pagada
 * @access  Private (Administrador, Veterinario, Recepcionista, Auxiliar)
 */
router.patch(
  '/:id/pagar',
  authorize('administrador', 'veterinario', 'recepcionista', 'auxiliar'),
  idValidation,
  handleValidationErrors,
  facturaController.marcarComoPagada
);

/**
 * @route   PATCH /api/facturas/:id/anular
 * @desc    Anular factura
 * @access  Private (Administrador, Veterinario, Recepcionista, Auxiliar)
 */
router.patch(
  '/:id/anular',
  authorize('administrador', 'veterinario', 'recepcionista', 'auxiliar'),
  idValidation,
  handleValidationErrors,
  facturaController.anular
);

/**
 * @route   DELETE /api/facturas/:id
 * @desc    Eliminar factura
 * @access  Private (Administrador, Veterinario)
 */
router.delete(
  '/:id',
  authorize('administrador', 'veterinario'),
  idValidation,
  handleValidationErrors,
  facturaController.delete
);

export default router;
