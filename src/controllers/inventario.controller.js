import inventarioService from '../services/inventario.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../utils/responses.js';

/**
 * Controller de inventario
 */
class InventarioController {
  /**
   * Obtener todos los productos
   * GET /api/inventario
   */
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, categoria, stockBajo, search } = req.query;

    const result = await inventarioService.getAll(
      parseInt(page),
      parseInt(limit),
      { categoria, stockBajo, search }
    );

    paginatedResponse(
      res,
      result.productos,
      result.pagination,
      'Productos obtenidos exitosamente'
    );
  });

  /**
   * Obtener producto por ID
   * GET /api/inventario/:id
   */
  getById = asyncHandler(async (req, res) => {
    const producto = await inventarioService.getById(req.params.id);

    successResponse(res, producto, 'Producto obtenido exitosamente', 200);
  });

  /**
   * Obtener productos con stock bajo
   * GET /api/inventario/stock-bajo
   */
  getStockBajo = asyncHandler(async (req, res) => {
    const productos = await inventarioService.getStockBajo();

    successResponse(
      res,
      productos,
      'Productos con stock bajo obtenidos exitosamente',
      200
    );
  });

  /**
   * Obtener productos por categoría
   * GET /api/inventario/categoria/:categoria
   */
  getByCategoria = asyncHandler(async (req, res) => {
    const productos = await inventarioService.getByCategoria(
      req.params.categoria
    );

    successResponse(res, productos, 'Productos obtenidos exitosamente', 200);
  });

  /**
   * Crear nuevo producto
   * POST /api/inventario
   */
  create = asyncHandler(async (req, res) => {
    const producto = await inventarioService.create(req.body);

    successResponse(res, producto, 'Producto creado exitosamente', 201);
  });

  /**
   * Actualizar producto
   * PUT /api/inventario/:id
   */
  update = asyncHandler(async (req, res) => {
    const producto = await inventarioService.update(req.params.id, req.body);

    successResponse(res, producto, 'Producto actualizado exitosamente', 200);
  });

  /**
   * Actualizar cantidad (entrada o salida)
   * PATCH /api/inventario/:id/cantidad
   */
  updateCantidad = asyncHandler(async (req, res) => {
    const { cantidad, tipo } = req.body;
    const producto = await inventarioService.updateCantidad(
      req.params.id,
      cantidad,
      tipo
    );

    successResponse(res, producto, 'Cantidad actualizada exitosamente', 200);
  });

  /**
   * Desactivar producto
   * DELETE /api/inventario/:id
   */
  delete = asyncHandler(async (req, res) => {
    const result = await inventarioService.delete(req.params.id);

    successResponse(res, result, 'Producto desactivado exitosamente', 200);
  });

  /**
   * Búsqueda avanzada de productos
   * GET /api/inventario/search
   */
  search = asyncHandler(async (req, res) => {
    const { q } = req.query;

    const productos = await inventarioService.search(q);

    successResponse(res, productos, 'Búsqueda realizada exitosamente', 200);
  });

  /**
   * Obtener estadísticas de inventario
   * GET /api/inventario/estadisticas
   */
  getEstadisticas = asyncHandler(async (req, res) => {
    const estadisticas = await inventarioService.getEstadisticas();

    successResponse(
      res,
      estadisticas,
      'Estadísticas obtenidas exitosamente',
      200
    );
  });
}

export default new InventarioController();
