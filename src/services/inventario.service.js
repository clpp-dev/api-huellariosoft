import { Inventario } from '../models/Inventario.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Servicio de inventario
 * Maneja operaciones CRUD de inventario
 */
class InventarioService {
  /**
   * Obtener todos los productos con paginación y filtros
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = { activo: true };

    // Filtros opcionales
    if (filters.categoria) {
      query.categoria = filters.categoria;
    }
    if (filters.stockBajo === 'true') {
      query.$expr = { $lte: ['$cantidad', '$stockMinimo'] };
    }
    if (filters.search) {
      query.$or = [
        { nombre: { $regex: filters.search, $options: 'i' } },
        { descripcion: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [productos, total] = await Promise.all([
      Inventario.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ nombre: 1 }),
      Inventario.countDocuments(query),
    ]);

    return {
      productos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener producto por ID
   */
  async getById(id) {
    const producto = await Inventario.findById(id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    return producto;
  }

  /**
   * Obtener productos con stock bajo
   */
  async getStockBajo() {
    const productos = await Inventario.find({
      activo: true,
      $expr: { $lte: ['$cantidad', '$stockMinimo'] },
    }).sort({ cantidad: 1 });

    return productos;
  }

  /**
   * Obtener productos por categoría
   */
  async getByCategoria(categoria) {
    const productos = await Inventario.find({
      categoria,
      activo: true,
    }).sort({ nombre: 1 });

    return productos;
  }

  /**
   * Crear nuevo producto
   */
  async create(productoData) {
    // Verificar si el producto ya existe
    const existingProducto = await Inventario.findOne({
      nombre: productoData.nombre,
    });

    if (existingProducto) {
      throw new ConflictError('El producto ya existe');
    }

    const producto = await Inventario.create(productoData);

    return producto;
  }

  /**
   * Actualizar producto
   */
  async update(id, updateData) {
    // Verificar si el nombre ya existe (si se está actualizando)
    if (updateData.nombre) {
      const existingProducto = await Inventario.findOne({
        nombre: updateData.nombre,
        _id: { $ne: id },
      });

      if (existingProducto) {
        throw new ConflictError('El nombre del producto ya está en uso');
      }
    }

    const producto = await Inventario.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    return producto;
  }

  /**
   * Actualizar cantidad (entrada o salida)
   */
  async updateCantidad(id, cantidad, tipo = 'entrada') {
    const producto = await Inventario.findById(id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    if (tipo === 'entrada') {
      producto.cantidad += cantidad;
    } else if (tipo === 'salida') {
      if (producto.cantidad < cantidad) {
        throw new ValidationError('Cantidad insuficiente en inventario');
      }
      producto.cantidad -= cantidad;
    }

    await producto.save();

    return producto;
  }

  /**
   * Desactivar producto (soft delete)
   */
  async delete(id) {
    const producto = await Inventario.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    return { message: 'Producto desactivado exitosamente' };
  }

  /**
   * Búsqueda avanzada
   */
  async search(searchTerm) {
    const productos = await Inventario.find({
      $text: { $search: searchTerm },
      activo: true,
    }).limit(20);

    return productos;
  }

  /**
   * Obtener estadísticas de inventario
   */
  async getEstadisticas() {
    const [
      totalProductos,
      productosBajoStock,
      valorTotalInventario,
      productosPorCategoria,
    ] = await Promise.all([
      Inventario.countDocuments({ activo: true }),
      Inventario.countDocuments({
        activo: true,
        $expr: { $lte: ['$cantidad', '$stockMinimo'] },
      }),
      Inventario.aggregate([
        { $match: { activo: true } },
        {
          $group: {
            _id: null,
            valorTotal: {
              $sum: { $multiply: ['$cantidad', '$precioVenta'] },
            },
          },
        },
      ]),
      Inventario.aggregate([
        { $match: { activo: true } },
        {
          $group: {
            _id: '$categoria',
            cantidad: { $sum: 1 },
            totalStock: { $sum: '$cantidad' },
          },
        },
      ]),
    ]);

    return {
      totalProductos,
      productosBajoStock,
      valorTotalInventario: valorTotalInventario[0]?.valorTotal || 0,
      productosPorCategoria,
    };
  }
}

export default new InventarioService();
