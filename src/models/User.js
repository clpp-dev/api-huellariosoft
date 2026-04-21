import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

/**
 * Modelo de Usuario
 * Roles: administrador, veterinario, recepcionista, auxiliar
 */
const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No incluir password en queries por defecto
    },
    rol: {
      type: String,
      enum: ['administrador', 'veterinario', 'recepcionista', 'auxiliar'],
      required: [true, 'El rol es requerido'],
    },
    telefono: {
      type: String,
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
userSchema.index({ email: 1 });
userSchema.index({ rol: 1 });
userSchema.index({ activo: 1 });

// Hook pre-save: Hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
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
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para convertir a JSON (excluir password)
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model('User', userSchema);
