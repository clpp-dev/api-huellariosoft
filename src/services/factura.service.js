import { Factura } from '../models/Factura.js';
import { Mascota } from '../models/Mascota.js';
import { Propietario } from '../models/Propietario.js';
import { Inventario } from '../models/Inventario.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Servicio de facturación
 * Maneja operaciones de facturas
 */
class FacturaService {
  /**
   * Obtener todas las facturas con paginación y filtros
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = {};

    // Filtros opcionales
    if (filters.propietario) {
      query.propietario = filters.propietario;
    }
    if (filters.mascota) {
      query.mascota = filters.mascota;
    }
    if (filters.estado) {
      query.estado = filters.estado;
    }
    if (filters.fechaInicio && filters.fechaFin) {
      query.createdAt = {
        $gte: new Date(filters.fechaInicio),
        $lte: new Date(filters.fechaFin),
      };
    }

    const [facturas, total] = await Promise.all([
      Factura.find(query)
        .populate('propietario', 'nombreCompleto documento telefono')
        .populate('mascota', 'nombre especie')
        .populate('creadaPor', 'nombre')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Factura.countDocuments(query),
    ]);

    return {
      facturas,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener factura por ID
   */
  async getById(id) {
    const factura = await Factura.findById(id)
      .populate('propietario')
      .populate('mascota')
      .populate('creadaPor', 'nombre email');

    if (!factura) {
      throw new NotFoundError('Factura no encontrada');
    }

    return factura;
  }

  /**
   * Obtener factura por número
   */
  async getByNumero(numeroFactura) {
    const factura = await Factura.findOne({ numeroFactura })
      .populate('propietario')
      .populate('mascota')
      .populate('creadaPor', 'nombre');

    if (!factura) {
      throw new NotFoundError('Factura no encontrada');
    }

    return factura;
  }

  /**
   * Obtener facturas por propietario
   */
  async getByPropietario(propietarioId) {
    const facturas = await Factura.find({ propietario: propietarioId })
      .populate('mascota', 'nombre')
      .sort({ createdAt: -1 });

    return facturas;
  }

  /**
   * Crear nueva factura
   */
  async create(facturaData, creadaPorId) {
    // Verificar que la mascota existe
    const mascota = await Mascota.findById(facturaData.mascota);
    if (!mascota) {
      throw new ValidationError('La mascota especificada no existe');
    }

    // Verificar que el propietario existe
    const propietario = await Propietario.findById(facturaData.propietario);
    if (!propietario) {
      throw new ValidationError('El propietario especificado no existe');
    }

    // Verificar stock de productos de inventario
    for (const servicio of facturaData.servicios) {
      if (servicio.producto) {
        const producto = await Inventario.findById(servicio.producto);
        
        if (!producto) {
          throw new ValidationError(`El producto ${servicio.descripcion} no existe en el inventario`);
        }

        if (producto.cantidad < servicio.cantidad) {
          throw new ValidationError(
            `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidad}, Requerido: ${servicio.cantidad}`
          );
        }
      }
    }

    // Crear factura (los cálculos se hacen en el pre-save del modelo)
    const factura = await Factura.create({
      ...facturaData,
      creadaPor: creadaPorId,
    });

    // Descontar productos del inventario
    for (const servicio of facturaData.servicios) {
      if (servicio.producto) {
        await Inventario.findByIdAndUpdate(servicio.producto, {
          $inc: { cantidad: -servicio.cantidad }
        });
      }
    }

    // Poblar referencias
    await factura.populate([
      { path: 'propietario', select: 'nombreCompleto documento telefono' },
      { path: 'mascota', select: 'nombre especie' },
      { path: 'creadaPor', select: 'nombre' },
      { path: 'servicios.producto', select: 'nombre unidadMedida' },
    ]);

    return factura;
  }

  /**
   * Actualizar factura
   */
  async update(id, updateData) {
    // No permitir actualizar si está pagada
    const facturaExistente = await Factura.findById(id);

    if (!facturaExistente) {
      throw new NotFoundError('Factura no encontrada');
    }

    if (facturaExistente.estado === 'pagada-presencial') {
      throw new ValidationError(
        'No se puede actualizar una factura que ya fue pagada'
      );
    }

    if (facturaExistente.estado === 'anulada') {
      throw new ValidationError('No se puede actualizar una factura anulada');
    }

    const factura = await Factura.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('propietario', 'nombreCompleto documento')
      .populate('mascota', 'nombre especie')
      .populate('creadaPor', 'nombre');

    return factura;
  }

  /**
   * Marcar factura como pagada
   */
  async marcarComoPagada(id, metodoPago) {
    const factura = await Factura.findById(id);

    if (!factura) {
      throw new NotFoundError('Factura no encontrada');
    }

    if (factura.estado === 'pagada-presencial') {
      throw new ValidationError('La factura ya está marcada como pagada');
    }

    if (factura.estado === 'anulada') {
      throw new ValidationError('No se puede pagar una factura anulada');
    }

    factura.estado = 'pagada-presencial';
    factura.metodoPago = metodoPago;
    factura.fechaPago = new Date();

    await factura.save();

    await factura.populate([
      { path: 'propietario', select: 'nombreCompleto documento' },
      { path: 'mascota', select: 'nombre especie' },
    ]);

    return factura;
  }

  /**
   * Anular factura
   */
  async anular(id, motivo) {
    const factura = await Factura.findById(id);

    if (!factura) {
      throw new NotFoundError('Factura no encontrada');
    }

    if (factura.estado === 'anulada') {
      throw new ValidationError('La factura ya está anulada');
    }

    factura.estado = 'anulada';
    if (motivo) {
      factura.motivoCancelacion = motivo;
    }
    await factura.save();

    return factura;
  }

  /**
   * Eliminar factura
   */
  async delete(id) {
    const factura = await Factura.findById(id);

    if (!factura) {
      throw new NotFoundError('Factura no encontrada');
    }

    // Solo permitir eliminar facturas pendientes
    if (factura.estado !== 'pendiente') {
      throw new ValidationError(
        'Solo se pueden eliminar facturas en estado pendiente'
      );
    }

    await factura.deleteOne();

    return { message: 'Factura eliminada exitosamente' };
  }

  /**
   * Obtener estadísticas de facturación
   */
  async getEstadisticas(fechaInicio, fechaFin) {
    const query = {};

    if (fechaInicio && fechaFin) {
      query.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    const [
      totalFacturas,
      facturasEstado,
      ingresosTotales,
      ingresosPorMetodo,
    ] = await Promise.all([
      Factura.countDocuments(query),
      Factura.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$estado',
            cantidad: { $sum: 1 },
            total: { $sum: '$total' },
          },
        },
      ]),
      Factura.aggregate([
        {
          $match: {
            ...query,
            estado: 'pagada-presencial',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ]),
      Factura.aggregate([
        {
          $match: {
            ...query,
            estado: 'pagada-presencial',
          },
        },
        {
          $group: {
            _id: '$metodoPago',
            total: { $sum: '$total' },
            cantidad: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalFacturas,
      facturasEstado,
      totalFacturado: ingresosTotales[0]?.total || 0,
      ingresosPorMetodo,
    };
  }
}

export default new FacturaService();
