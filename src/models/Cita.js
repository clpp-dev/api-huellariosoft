import { Schema, model } from 'mongoose';

/**
 * Modelo de Cita Veterinaria
 */
const citaSchema = new Schema(
  {
    mascota: {
      type: Schema.Types.ObjectId,
      ref: 'Mascota',
      required: [true, 'La mascota es requerida'],
    },
    propietario: {
      type: Schema.Types.ObjectId,
      ref: 'Propietario',
      required: [true, 'El propietario es requerido'],
    },
    veterinario: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El veterinario es requerido'],
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha es requerida'],
    },
    hora: {
      type: String,
      required: [true, 'La hora es requerida'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'El formato de hora debe ser HH:MM'],
    },
    motivo: {
      type: String,
      required: [true, 'El motivo de la cita es requerido'],
      trim: true,
      maxlength: [300, 'El motivo no puede exceder 300 caracteres'],
    },
    estado: {
      type: String,
      enum: ['agendada', 'confirmada', 'en-curso', 'completada', 'cancelada', 'no-asistio'],
      default: 'agendada',
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres'],
    },
    creadaPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Índices
citaSchema.index({ fecha: 1, hora: 1 });
citaSchema.index({ mascota: 1 });
citaSchema.index({ propietario: 1 });
citaSchema.index({ veterinario: 1, fecha: 1 });
citaSchema.index({ estado: 1 });

// Índice compuesto para evitar citas duplicadas (mismo veterinario, fecha y hora)
citaSchema.index({ veterinario: 1, fecha: 1, hora: 1 }, { unique: true });

export const Cita = model('Cita', citaSchema);
