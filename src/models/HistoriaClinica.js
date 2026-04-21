import { Schema, model } from 'mongoose';

/**
 * Modelo de Historia Clínica Veterinaria
 */
const historiaClinicaSchema = new Schema(
  {
    mascota: {
      type: Schema.Types.ObjectId,
      ref: 'Mascota',
      required: [true, 'La mascota es requerida'],
    },
    cita: {
      type: Schema.Types.ObjectId,
      ref: 'Cita',
    },
    veterinario: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El veterinario es requerido'],
    },
    fechaConsulta: {
      type: Date,
      default: Date.now,
    },
    motivoConsulta: {
      type: String,
      required: [true, 'El motivo de consulta es requerido'],
      trim: true,
      maxlength: [300, 'El motivo no puede exceder 300 caracteres'],
    },
    sintomas: {
      type: String,
      trim: true,
      maxlength: [1000, 'Los síntomas no pueden exceder 1000 caracteres'],
    },
    diagnostico: {
      type: String,
      trim: true,
      maxlength: [1000, 'El diagnóstico no puede exceder 1000 caracteres'],
    },
    tratamiento: {
      type: String,
      trim: true,
      maxlength: [1000, 'El tratamiento no puede exceder 1000 caracteres'],
    },
    vacunas: [
      {
        nombre: String,
        fecha: Date,
        proximaDosis: Date,
      },
    ],
    cirugias: [
      {
        nombre: String,
        fecha: Date,
        descripcion: String,
      },
    ],
    examenes: [
      {
        tipo: String,
        fecha: Date,
        resultado: String,
        archivo: String,
      },
    ],
    peso: {
      type: Number,
      min: 0,
    },
    temperatura: {
      type: Number,
      min: 0,
      max: 45,
    },
    frecuenciaCardiaca: {
      type: Number,
      min: 0,
    },
    frecuenciaRespiratoria: {
      type: Number,
      min: 0,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres'],
    },
    archivosAdjuntos: [
      {
        nombre: String,
        url: String,
        tipo: String,
        fechaSubida: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Índices
historiaClinicaSchema.index({ mascota: 1, fechaConsulta: -1 });
historiaClinicaSchema.index({ veterinario: 1 });
historiaClinicaSchema.index({ cita: 1 });

export const HistoriaClinica = model('HistoriaClinica', historiaClinicaSchema);
