import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

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
      required: [true, 'El email es requerido'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No incluir password en queries por defecto
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
propietarioSchema.index({ email: 1 });
propietarioSchema.index({ activo: 1 });

// Índice de texto para búsqueda
propietarioSchema.index({ nombreCompleto: 'text', documento: 'text' });

// Hook pre-save: Hashear contraseña antes de guardar
propietarioSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
propietarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para convertir a JSON (excluir password)
propietarioSchema.methods.toJSON = function () {
  const propietario = this.toObject();
  delete propietario.password;
  return propietario;
};

export const Propietario = model('Propietario', propietarioSchema);
