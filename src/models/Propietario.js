import { Schema, model } from 'mongoose';

/**
 * Modelo de Propietario (Cliente)
 */
const propietarioSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    },
    documento: {
      type: String,
      required: [true, 'El documento es requerido'],
      unique: true,
      trim: true,
      maxlength: [20, 'El documento no puede exceder 20 caracteres'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
      maxlength: [20, 'El teléfono no puede exceder 20 caracteres'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    direccion: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres'],
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
propietarioSchema.index({ documento: 1 });
propietarioSchema.index({ nombreCompleto: 1 });
propietarioSchema.index({ activo: 1 });

// Índice de texto para búsqueda
propietarioSchema.index({ nombreCompleto: 'text', documento: 'text' });

export const Propietario = model('Propietario', propietarioSchema);
