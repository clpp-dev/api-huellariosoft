import { Cita } from '../models/Cita.js';
import { Mascota } from '../models/Mascota.js';
import { Propietario } from '../models/Propietario.js';
import { User } from '../models/User.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';

/**
 * Servicio de citas veterinarias
 * Maneja operaciones CRUD de citas
 */
class CitaService {
  /**
   * Obtener todas las citas con filtros y paginación
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = {};

    // Filtros opcionales
    if (filters.fecha) {
      const startOfDay = new Date(filters.fecha);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.fecha);
      endOfDay.setHours(23, 59, 59, 999);

      query.fecha = { $gte: startOfDay, $lte: endOfDay };
    }
    if (filters.veterinario) {
      query.veterinario = filters.veterinario;
    }
    if (filters.mascota) {
      query.mascota = filters.mascota;
    }
    if (filters.propietario) {
      query.propietario = filters.propietario;
    }
    if (filters.estado) {
      query.estado = filters.estado;
    }

    // Búsqueda por nombre de mascota o propietario
    if (filters.q) {
      const searchRegex = new RegExp(filters.q, 'i');
      
      // Buscar propietarios que coincidan
      const propietarios = await Propietario.find({
        nombreCompleto: searchRegex
      }).select('_id');
      
      const propietariosIds = propietarios.map(p => p._id);
      
      // Buscar mascotas por nombre o por propietario
      const mascotas = await Mascota.find({
        $or: [
          { nombre: searchRegex },
          { propietario: { $in: propietariosIds } }
        ]
      }).select('_id');
      
      const mascotasIds = mascotas.map(m => m._id);
      
      if (mascotasIds.length > 0 || propietariosIds.length > 0) {
        query.$or = [
          { mascota: { $in: mascotasIds } },
          { propietario: { $in: propietariosIds } }
        ];
      } else {
        // Si no hay coincidencias, retornar vacío
        return {
          citas: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
          },
        };
      }
    }

    const [citas, total] = await Promise.all([
      Cita.find(query)
        .populate('mascota', 'nombre especie raza numeroHistoriaClinica')
        .populate('propietario', 'nombreCompleto telefono')
        .populate('veterinario', 'nombre email')
        .populate('creadaPor', 'nombre')
        .skip(skip)
        .limit(limit)
        .sort({ fecha: -1, hora: -1 }),
      Cita.countDocuments(query),
    ]);

    return {
      citas,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener cita por ID
   */
  async getById(id) {
    const cita = await Cita.findById(id)
      .populate('mascota')
      .populate('propietario')
      .populate('veterinario', 'nombre email telefono')
      .populate('creadaPor', 'nombre');

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    return cita;
  }

  /**
   * Obtener citas por fecha
   */
  async getByFecha(fecha) {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    const citas = await Cita.find({
      fecha: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('mascota', 'nombre especie')
      .populate('propietario', 'nombreCompleto telefono')
      .populate('veterinario', 'nombre')
      .sort({ hora: 1 });

    return citas;
  }

  /**
   * Obtener citas por veterinario
   */
  async getByVeterinario(veterinarioId, fecha) {
    const query = { veterinario: veterinarioId };

    if (fecha) {
      const startOfDay = new Date(fecha);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(fecha);
      endOfDay.setHours(23, 59, 59, 999);

      query.fecha = { $gte: startOfDay, $lte: endOfDay };
    }

    const citas = await Cita.find(query)
      .populate('mascota', 'nombre especie numeroHistoriaClinica')
      .populate('propietario', 'nombreCompleto telefono')
      .sort({ fecha: 1, hora: 1 });

    return citas;
  }

  /**
   * Crear nueva cita
   */
  async create(citaData, creadaPorId) {
    // Verificar que la mascota existe
    const mascota = await Mascota.findById(citaData.mascota);
    if (!mascota) {
      throw new ValidationError('La mascota especificada no existe');
    }

    // Verificar que el propietario existe
    const propietario = await Propietario.findById(citaData.propietario);
    if (!propietario) {
      throw new ValidationError('El propietario especificado no existe');
    }

    // Verificar que el veterinario existe y es veterinario
    const veterinario = await User.findById(citaData.veterinario);
    if (!veterinario || veterinario.rol !== 'veterinario') {
      throw new ValidationError('El veterinario especificado no es válido');
    }

    // Verificar que no haya cita duplicada (mismo veterinario, fecha y hora)
    const citaExistente = await Cita.findOne({
      veterinario: citaData.veterinario,
      fecha: citaData.fecha,
      hora: citaData.hora,
      estado: { $nin: ['cancelada', 'no-asistio'] },
    });

    if (citaExistente) {
      throw new ConflictError(
        'Ya existe una cita para este veterinario en la fecha y hora especificadas'
      );
    }

    // Crear cita
    const cita = await Cita.create({
      ...citaData,
      creadaPor: creadaPorId,
    });

    // Poblar referencias
    await cita.populate([
      { path: 'mascota', select: 'nombre especie' },
      { path: 'propietario', select: 'nombreCompleto telefono' },
      { path: 'veterinario', select: 'nombre' },
    ]);

    return cita;
  }

  /**
   * Actualizar cita
   */
  async update(id, updateData) {
    // Si se actualiza veterinario, fecha u hora, verificar disponibilidad
    if (updateData.veterinario || updateData.fecha || updateData.hora) {
      const citaActual = await Cita.findById(id);

      if (!citaActual) {
        throw new NotFoundError('Cita no encontrada');
      }

      const veterinarioId = updateData.veterinario || citaActual.veterinario;
      const fecha = updateData.fecha || citaActual.fecha;
      const hora = updateData.hora || citaActual.hora;

      const citaExistente = await Cita.findOne({
        _id: { $ne: id },
        veterinario: veterinarioId,
        fecha: fecha,
        hora: hora,
        estado: { $nin: ['cancelada', 'no-asistio'] },
      });

      if (citaExistente) {
        throw new ConflictError(
          'Ya existe una cita para este veterinario en la fecha y hora especificadas'
        );
      }
    }

    const cita = await Cita.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('mascota', 'nombre especie')
      .populate('propietario', 'nombreCompleto telefono')
      .populate('veterinario', 'nombre');

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    return cita;
  }

  /**
   * Cambiar estado de cita
   */
  async updateEstado(id, nuevoEstado) {
    const cita = await Cita.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true }
    )
      .populate('mascota', 'nombre especie')
      .populate('propietario', 'nombreCompleto telefono')
      .populate('veterinario', 'nombre');

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    return cita;
  }

  /**
   * Cancelar cita
   */
  async cancelar(id) {
    return this.updateEstado(id, 'cancelada');
  }

  /**
   * Eliminar cita
   */
  async delete(id) {
    const cita = await Cita.findByIdAndDelete(id);

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    return { message: 'Cita eliminada exitosamente' };
  }
}

export default new CitaService();
