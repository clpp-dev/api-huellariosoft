import { Schema, model } from 'mongoose';

/**
 * Modelo de Inventario
 */
const inventarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: [
        'medicamento',
        'vacuna',
        'material-quirurgico',
        'alimento',
        'accesorio',
        'insumo',
        'otro',
      ],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0,
    },
    stockMinimo: {
      type: Number,
      required: [true, 'El stock mínimo es requerido'],
      min: [0, 'El stock mínimo no puede ser negativo'],
      default: 5,
    },
    unidadMedida: {
      type: String,
      enum: ['unidad', 'caja', 'frasco', 'sobre', 'ml', 'gr', 'kg', 'otro'],
      default: 'unidad',
    },
    precioCompra: {
      type: Number,
      min: [0, 'El precio de compra no puede ser negativo'],
    },
    precioVenta: {
      type: Number,
      required: [true, 'El precio de venta es requerido'],
      min: [0, 'El precio de venta no puede ser negativo'],
    },
    proveedor: {
      type: String,
      trim: true,
      maxlength: [150, 'El proveedor no puede exceder 150 caracteres'],
    },
    fechaIngreso: {
      type: Date,
      default: Date.now,
    },
    fechaVencimiento: {
      type: Date,
    },
    lote: {
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
inventarioSchema.index({ nombre: 1 });
inventarioSchema.index({ categoria: 1 });
inventarioSchema.index({ cantidad: 1 });
inventarioSchema.index({ activo: 1 });

// Índice de texto para búsqueda
inventarioSchema.index({ nombre: 'text', descripcion: 'text' });

// Virtual para verificar si está en stock bajo
inventarioSchema.virtual('stockBajo').get(function () {
  return this.cantidad <= this.stockMinimo;
});

export const Inventario = model('Inventario', inventarioSchema);
