import { Mascota } from '../models/Mascota.js';
import { Propietario } from '../models/Propietario.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Servicio de mascotas
 * Maneja operaciones CRUD de mascotas
 */
class MascotaService {
  /**
   * Obtener todas las mascotas con paginación y búsqueda
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = { activo: true };

    // Filtros opcionales
    if (filters.propietario) {
      query.propietario = filters.propietario;
    }
    if (filters.especie) {
      query.especie = filters.especie;
    }
    
    // Búsqueda por nombre de mascota o nombre de propietario
    if (filters.search) {
      // Buscar propietarios que coincidan
      const propietarios = await Propietario.find({
        nombreCompleto: { $regex: filters.search, $options: 'i' },
        activo: true
      }).select('_id');
      
      const propietarioIds = propietarios.map(p => p._id);
      
      query.$or = [
        { nombre: { $regex: filters.search, $options: 'i' } },
        { numeroHistoriaClinica: { $regex: filters.search, $options: 'i' } },
        { propietario: { $in: propietarioIds } }
      ];
    }

    const [mascotas, total] = await Promise.all([
      Mascota.find(query)
        .populate('propietario', 'nombreCompleto documento telefono')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Mascota.countDocuments(query),
    ]);

    return {
      mascotas,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener mascota por ID
   */
  async getById(id) {
    const mascota = await Mascota.findById(id).populate(
      'propietario',
      'nombreCompleto documento telefono email direccion'
    );

    if (!mascota) {
      throw new NotFoundError('Mascota no encontrada');
    }

    return mascota;
  }

  /**
   * Obtener mascota por número de historia clínica
   */
  async getByHistoriaClinica(numeroHistoriaClinica) {
    const mascota = await Mascota.findOne({
      numeroHistoriaClinica,
      activo: true,
    }).populate('propietario');

    if (!mascota) {
      throw new NotFoundError('Mascota no encontrada');
    }

    return mascota;
  }

  /**
   * Obtener mascotas por propietario
   */
  async getByPropietario(propietarioId) {
    const mascotas = await Mascota.find({
      propietario: propietarioId,
      activo: true,
    }).sort({ createdAt: -1 });

    return mascotas;
  }

  /**
   * Crear nueva mascota
   */
  async create(mascotaData) {
    // Verificar que el propietario existe
    const propietario = await Propietario.findById(mascotaData.propietario);

    if (!propietario) {
      throw new ValidationError('El propietario especificado no existe');
    }

    const mascota = await Mascota.create(mascotaData);

    // Poblar propietario antes de devolver
    await mascota.populate('propietario', 'nombreCompleto documento telefono');

    return mascota;
  }

  /**
   * Actualizar mascota
   */
  async update(id, updateData) {
    // Si se está actualizando el propietario, verificar que existe
    if (updateData.propietario) {
      const propietario = await Propietario.findById(updateData.propietario);

      if (!propietario) {
        throw new ValidationError('El propietario especificado no existe');
      }
    }

    const mascota = await Mascota.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('propietario', 'nombreCompleto documento telefono');

    if (!mascota) {
      throw new NotFoundError('Mascota no encontrada');
    }

    return mascota;
  }

  /**
   * Desactivar mascota (soft delete)
   */
  async delete(id) {
    const mascota = await Mascota.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!mascota) {
      throw new NotFoundError('Mascota no encontrada');
    }

    return { message: 'Mascota desactivada exitosamente' };
  }

  /**
   * Búsqueda avanzada
   */
  async search(searchTerm) {
    const mascotas = await Mascota.find({
      $text: { $search: searchTerm },
      activo: true,
    })
      .populate('propietario', 'nombreCompleto documento')
      .limit(20);

    return mascotas;
  }
}

export default new MascotaService();
