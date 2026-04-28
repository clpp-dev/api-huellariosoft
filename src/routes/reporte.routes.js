import { Router } from 'express';
import reporteController from '../controllers/reporte.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authenticate);

/**
 * @route   GET /api/reportes/facturacion/pdf
 * @desc    Genera reporte PDF de facturación
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/facturacion/pdf', reporteController.generarReporteFacturacion);

/**
 * @route   GET /api/reportes/facturacion/preview
 * @desc    Obtiene vista previa de estadísticas de facturación
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/facturacion/preview', reporteController.getPreviewFacturacion);

/**
 * @route   GET /api/reportes/citas/pdf
 * @desc    Genera reporte PDF de citas
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/citas/pdf', reporteController.generarReporteCitas);

/**
 * @route   GET /api/reportes/citas/preview
 * @desc    Obtiene vista previa de estadísticas de citas
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/citas/preview', reporteController.getPreviewCitas);

/**
 * @route   GET /api/reportes/mascotas/pdf
 * @desc    Genera reporte PDF de mascotas registradas
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/mascotas/pdf', reporteController.generarReporteMascotas);

/**
 * @route   GET /api/reportes/mascotas/preview
 * @desc    Obtiene vista previa de estadísticas de mascotas
 * @access  Private
 * @query   fechaInicio, fechaFin (opcional, por defecto mes actual)
 */
router.get('/mascotas/preview', reporteController.getPreviewMascotas);

export default router;
