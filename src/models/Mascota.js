import { Schema, model } from 'mongoose';

/**
 * Modelo de Mascota (Paciente)
 */
const mascotaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la mascota es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    especie: {
      type: String,
      required: [true, 'La especie es requerida'],
      enum: ['Canino', 'Felino', 'Ave', 'Roedor', 'Reptil', 'Otro'],
    },
    raza: {
      type: String,
      trim: true,
      maxlength: [100, 'La raza no puede exceder 100 caracteres'],
    },
    sexo: {
      type: String,
      required: [true, 'El sexo es requerido'],
      enum: ['Macho', 'Hembra'],
    },
    edad: {
      valor: {
        type: Number,
        min: 0,
      },
      unidad: {
        type: String,
        enum: ['dias', 'meses', 'años'],
        default: 'años',
      },
    },
    peso: {
      type: Number,
      min: [0, 'El peso no puede ser negativo'],
      max: [500, 'El peso no puede exceder 500 kg'],
    },
    color: {
      type: String,
      trim: true,
      maxlength: [100, 'El color no puede exceder 100 caracteres'],
    },
    estadoReproductivo: {
      type: String,
      enum: ['entero', 'castrado', 'esterilizado'],
    },
    foto: {
      type: String,
      trim: true,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres'],
    },
    propietario: {
      type: Schema.Types.ObjectId,
      ref: 'Propietario',
      required: [true, 'El propietario es requerido'],
    },
    numeroHistoriaClinica: {
      type: String,
      unique: true,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
mascotaSchema.index({ propietario: 1 });
mascotaSchema.index({ numeroHistoriaClinica: 1 });
mascotaSchema.index({ nombre: 1 });
mascotaSchema.index({ activo: 1 });

// Índice de texto para búsqueda
mascotaSchema.index({ nombre: 'text', raza: 'text' });

// Generar número de historia clínica automáticamente
mascotaSchema.pre('save', async function (next) {
  if (!this.numeroHistoriaClinica) {
    const count = await model('Mascota').countDocuments();
    this.numeroHistoriaClinica = `HC${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export const Mascota = model('Mascota', mascotaSchema);
