import { HistoriaClinica } from '../models/HistoriaClinica.js';
import { Mascota } from '../models/Mascota.js';
import { User } from '../models/User.js';
import { Cita } from '../models/Cita.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Servicio de historia clínica veterinaria
 * Maneja operaciones de historias clínicas
 */
class HistoriaClinicaService {
  /**
   * Obtener historias clínicas con paginación y filtros
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.mascota) {
      query.mascota = filters.mascota;
    }
    if (filters.veterinario) {
      query.veterinario = filters.veterinario;
    }

    const [historias, total] = await Promise.all([
      HistoriaClinica.find(query)
        .populate('mascota', 'nombre especie numeroHistoriaClinica')
        .populate('veterinario', 'nombre')
        .populate('cita')
        .skip(skip)
        .limit(limit)
        .sort({ fechaConsulta: -1 }),
      HistoriaClinica.countDocuments(query),
    ]);

    return {
      historias,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener historia clínica por ID
   */
  async getById(id) {
    const historia = await HistoriaClinica.findById(id)
      .populate('mascota')
      .populate('veterinario', 'nombre email')
      .populate('cita');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Obtener historias clínicas de una mascota
   */
  async getByMascota(mascotaId) {
    const historias = await HistoriaClinica.find({ mascota: mascotaId })
      .populate('veterinario', 'nombre')
      .populate('cita')
      .sort({ fechaConsulta: -1 });

    return historias;
  }

  /**
   * Crear nueva historia clínica
   */
  async create(historiaData, veterinarioId) {
    // Verificar que la mascota existe
    const mascota = await Mascota.findById(historiaData.mascota);
    if (!mascota) {
      throw new ValidationError('La mascota especificada no existe');
    }

    // Verificar que el veterinario existe
    const veterinario = await User.findById(veterinarioId);
    if (!veterinario || veterinario.rol !== 'veterinario') {
      throw new ValidationError('El veterinario no es válido');
    }

    // Si hay una cita asociada, marcarla como completada
    if (historiaData.cita) {
      await Cita.findByIdAndUpdate(historiaData.cita, {
        estado: 'completada',
      });
    }

    // Crear historia clínica
    const historia = await HistoriaClinica.create({
      ...historiaData,
      veterinario: veterinarioId,
    });

    // Poblar referencias
    await historia.populate([
      { path: 'mascota', select: 'nombre especie numeroHistoriaClinica' },
      { path: 'veterinario', select: 'nombre' },
    ]);

    return historia;
  }

  /**
   * Actualizar historia clínica
   */
  async update(id, updateData) {
    const historia = await HistoriaClinica.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('mascota', 'nombre especie numeroHistoriaClinica')
      .populate('veterinario', 'nombre');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Agregar vacuna
   */
  async addVacuna(id, vacunaData) {
    const historia = await HistoriaClinica.findByIdAndUpdate(
      id,
      { $push: { vacunas: vacunaData } },
      { new: true }
    )
      .populate('mascota', 'nombre especie')
      .populate('veterinario', 'nombre');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Agregar cirugía
   */
  async addCirugia(id, cirugiaData) {
    const historia = await HistoriaClinica.findByIdAndUpdate(
      id,
      { $push: { cirugias: cirugiaData } },
      { new: true }
    )
      .populate('mascota', 'nombre especie')
      .populate('veterinario', 'nombre');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Agregar examen
   */
  async addExamen(id, examenData) {
    const historia = await HistoriaClinica.findByIdAndUpdate(
      id,
      { $push: { examenes: examenData } },
      { new: true }
    )
      .populate('mascota', 'nombre especie')
      .populate('veterinario', 'nombre');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Agregar archivo adjunto
   */
  async addArchivo(id, archivoData) {
    const historia = await HistoriaClinica.findByIdAndUpdate(
      id,
      { $push: { archivosAdjuntos: archivoData } },
      { new: true }
    )
      .populate('mascota', 'nombre especie')
      .populate('veterinario', 'nombre');

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return historia;
  }

  /**
   * Eliminar historia clínica
   */
  async delete(id) {
    const historia = await HistoriaClinica.findByIdAndDelete(id);

    if (!historia) {
      throw new NotFoundError('Historia clínica no encontrada');
    }

    return { message: 'Historia clínica eliminada exitosamente' };
  }
}

export default new HistoriaClinicaService();
