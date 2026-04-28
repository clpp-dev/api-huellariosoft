import { Propietario } from '../models/Propietario.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Servicio de propietarios
 * Maneja operaciones CRUD de propietarios
 */
class PropietarioService {
  /**
   * Obtener todos los propietarios con paginación y búsqueda
   */
  async getAll(page = 1, limit = 10, q = '') {
    const skip = (page - 1) * limit;

    const query = { activo: true };

    // Búsqueda por nombre, documento o teléfono
    if (q) {
      query.$or = [
        { nombreCompleto: { $regex: q, $options: 'i' } },
        { documento: { $regex: q, $options: 'i' } },
        { telefono: { $regex: q, $options: 'i' } },
      ];
    }

    const [propietarios, total] = await Promise.all([
      Propietario.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Propietario.countDocuments(query),
    ]);

    return {
      propietarios,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener propietario por ID
   */
  async getById(id) {
    const propietario = await Propietario.findById(id);

    if (!propietario) {
      throw new NotFoundError('Propietario no encontrado');
    }

    return propietario;
  }

  /**
   * Buscar propietario por documento
   */
  async getByDocumento(documento) {
    const propietario = await Propietario.findOne({ documento, activo: true });

    if (!propietario) {
      throw new NotFoundError('Propietario no encontrado');
    }

    return propietario;
  }

  /**
   * Crear nuevo propietario
   */
  async create(propietarioData) {
    // Verificar si el documento ya existe
    const existingPropietario = await Propietario.findOne({
      documento: propietarioData.documento,
    });

    if (existingPropietario) {
      throw new ConflictError('El documento ya está registrado');
    }

    const propietario = await Propietario.create(propietarioData);

    return propietario;
  }

  /**
   * Actualizar propietario
   */
  async update(id, updateData) {
    // Verificar si el documento ya existe (si se está actualizando)
    if (updateData.documento) {
      const existingPropietario = await Propietario.findOne({
        documento: updateData.documento,
        _id: { $ne: id },
      });

      if (existingPropietario) {
        throw new ConflictError('El documento ya está en uso');
      }
    }

    const propietario = await Propietario.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!propietario) {
      throw new NotFoundError('Propietario no encontrado');
    }

    return propietario;
  }

  /**
   * Desactivar propietario (soft delete)
   */
  async delete(id) {
    const propietario = await Propietario.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!propietario) {
      throw new NotFoundError('Propietario no encontrado');
    }

    return { message: 'Propietario desactivado exitosamente' };
  }

  /**
   * Búsqueda avanzada
   */
  async search(searchTerm) {
    const propietarios = await Propietario.find({
      $text: { $search: searchTerm },
      activo: true,
    }).limit(20);

    return propietarios;
  }
}

export default new PropietarioService();
