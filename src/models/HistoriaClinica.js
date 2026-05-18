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
    // Anamnésicos
    anamnesicos: {
      type: String,
      trim: true,
      maxlength: [2000, 'Los anamnésicos no pueden exceder 2000 caracteres'],
    },
    sintomas: {
      type: String,
      trim: true,
      maxlength: [1000, 'Los síntomas no pueden exceder 1000 caracteres'],
    },
    // Examen Físico
    examenFisico: {
      muscosas: {
        type: String,
        enum: ['Pálidas', 'Rosadas', 'Congestionadas', 'Cianóticas', 'Ictéricas', 'Otro'],
        trim: true,
      },
      deshidratacion: {
        type: Number,
        min: 1,
        max: 5,
      },
      condicionCorporal: {
        type: Number,
        min: 1,
        max: 5,
      },
      actitudPropietario: {
        type: String,
        enum: ['Amigable', 'Nervioso', 'Agresivo', 'Temeroso', 'Colaborador', 'Otro'],
        trim: true,
      },
      actitudVeterinario: {
        type: String,
        enum: ['Amigable', 'Nervioso', 'Agresivo', 'Temeroso', 'Colaborador', 'Otro'],
        trim: true,
      },
    },
    // Sistemas Afectados
    sistemasAfectados: {
      descripcion: {
        type: String,
        trim: true,
        maxlength: [2000, 'La descripción no puede exceder 2000 caracteres'],
      },
      pulso: {
        type: String,
        trim: true,
        maxlength: [100, 'El pulso no puede exceder 100 caracteres'],
      },
      tllc: {
        type: String,
        trim: true,
        maxlength: [100, 'El TLLC no puede exceder 100 caracteres'],
      },
      trpc: {
        type: String,
        trim: true,
        maxlength: [100, 'El TRPC no puede exceder 100 caracteres'],
      },
      examenesComplementarios: {
        type: String,
        trim: true,
        maxlength: [2000, 'Los exámenes complementarios no pueden exceder 2000 caracteres'],
      },
      listaProblemas: {
        type: String,
        trim: true,
        maxlength: [2000, 'La lista de problemas no puede exceder 2000 caracteres'],
      },
      listaMaestra: {
        type: String,
        trim: true,
        maxlength: [2000, 'La lista maestra no puede exceder 2000 caracteres'],
      },
    },
    // Evaluación Clínica
    evaluacionClinica: {
      pronostico: {
        type: String,
        trim: true,
        maxlength: [1000, 'El pronóstico no puede exceder 1000 caracteres'],
      },
      diagnostico: {
        type: String,
        trim: true,
        maxlength: [2000, 'El diagnóstico no puede exceder 2000 caracteres'],
      },
      tratamiento: {
        type: String,
        trim: true,
        maxlength: [2000, 'El tratamiento no puede exceder 2000 caracteres'],
      },
    },
    // Campos legacy (mantener para retrocompatibilidad)
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
