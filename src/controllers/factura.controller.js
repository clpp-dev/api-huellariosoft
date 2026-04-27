import facturaService from '../services/factura.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de facturas
 */
class FacturaController {
  /**
   * Obtener todas las facturas
   * GET /api/facturas
   */
  getAll = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      propietario,
      mascota,
      estado,
      fechaInicio,
      fechaFin,
    } = req.query;

    const result = await facturaService.getAll(parseInt(page), parseInt(limit), {
      propietario,
      mascota,
      estado,
      fechaInicio,
      fechaFin,
    });

    paginatedResponse(
      res,
      result.facturas,
      result.pagination,
      'Facturas obtenidas exitosamente'
    );
  });

  /**
   * Obtener factura por ID
   * GET /api/facturas/:id
   */
  getById = asyncHandler(async (req, res) => {
    const factura = await facturaService.getById(req.params.id);

    successResponse(res, factura, 'Factura obtenida exitosamente', 200);
  });

  /**
   * Obtener factura por número
   * GET /api/facturas/numero/:numeroFactura
   */
  getByNumero = asyncHandler(async (req, res) => {
    const factura = await facturaService.getByNumero(req.params.numeroFactura);

    successResponse(res, factura, 'Factura encontrada exitosamente', 200);
  });

  /**
   * Obtener facturas por propietario
   * GET /api/facturas/propietario/:propietarioId
   */
  getByPropietario = asyncHandler(async (req, res) => {
    const facturas = await facturaService.getByPropietario(
      req.params.propietarioId
    );

    successResponse(res, facturas, 'Facturas obtenidas exitosamente', 200);
  });

  /**
   * Crear nueva factura
   * POST /api/facturas
   */
  create = asyncHandler(async (req, res) => {
    const factura = await facturaService.create(req.body, req.user._id);

    successResponse(res, factura, 'Factura creada exitosamente', 201);
  });

  /**
   * Actualizar factura
   * PUT /api/facturas/:id
   */
  update = asyncHandler(async (req, res) => {
    const factura = await facturaService.update(req.params.id, req.body);

    successResponse(res, factura, 'Factura actualizada exitosamente', 200);
  });

  /**
   * Marcar factura como pagada
   * PATCH /api/facturas/:id/pagar
   */
  marcarComoPagada = asyncHandler(async (req, res) => {
    const { metodoPago } = req.body;
    const factura = await facturaService.marcarComoPagada(
      req.params.id,
      metodoPago
    );

    successResponse(res, factura, 'Factura marcada como pagada exitosamente', 200);
  });

  /**
   * Anular factura
   * PATCH /api/facturas/:id/anular
   */
  anular = asyncHandler(async (req, res) => {
    const { motivo } = req.body;
    const factura = await facturaService.anular(req.params.id, motivo);

    successResponse(res, factura, 'Factura anulada exitosamente', 200);
  });

  /**
   * Eliminar factura
   * DELETE /api/facturas/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await facturaService.delete(req.params.id);

    successResponse(res, result, 'Factura eliminada exitosamente', 200);
  });

  /**
   * Obtener estadísticas de facturación
   * GET /api/facturas/estadisticas
   */
  getEstadisticas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    const estadisticas = await facturaService.getEstadisticas(
      fechaInicio,
      fechaFin
    );

    successResponse(
      res,
      estadisticas,
      'Estadísticas obtenidas exitosamente',
      200
    );
  });
}

export default new FacturaController();
