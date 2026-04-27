import { Schema, model } from 'mongoose';

/**
 * Modelo de Factura
 */
const facturaSchema = new Schema(
  {
    numeroFactura: {
      type: String,
      unique: true,
      trim: true,
    },
    propietario: {
      type: Schema.Types.ObjectId,
      ref: 'Propietario',
      required: [true, 'El propietario es requerido'],
    },
    mascota: {
      type: Schema.Types.ObjectId,
      ref: 'Mascota',
      required: [true, 'La mascota es requerida'],
    },
    servicios: [
      {
        tipo: {
          type: String,
          enum: [
            'consulta',
            'cirugia',
            'vacunacion',
            'desparasitacion',
            'examen',
            'hospitalizacion',
            'estetica',
            'producto',
            'otro',
          ],
          required: true,
        },
        descripcion: {
          type: String,
          required: true,
          trim: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        precioUnitario: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
        // Referencia al producto de inventario (si aplica)
        producto: {
          type: Schema.Types.ObjectId,
          ref: 'Inventario',
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    impuestos: {
      type: Number,
      default: 0,
      min: 0,
    },
    descuento: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagada-presencial', 'anulada'],
      default: 'pendiente',
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia', 'otro'],
    },
    fechaPago: {
      type: Date,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres'],
    },
    creadaPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
facturaSchema.index({ numeroFactura: 1 });
facturaSchema.index({ propietario: 1 });
facturaSchema.index({ mascota: 1 });
facturaSchema.index({ estado: 1 });
facturaSchema.index({ createdAt: -1 });

// Generar número de factura automáticamente
facturaSchema.pre('save', async function (next) {
  if (!this.numeroFactura) {
    const count = await model('Factura').countDocuments();
    this.numeroFactura = `FAC${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

// Calcular totales antes de guardar
facturaSchema.pre('save', function (next) {
  // Calcular subtotal de servicios
  if (this.servicios && this.servicios.length > 0) {
    this.servicios.forEach((servicio) => {
      servicio.subtotal = servicio.cantidad * servicio.precioUnitario;
    });

    // Calcular subtotal total
    this.subtotal = this.servicios.reduce((sum, s) => sum + s.subtotal, 0);
  }

  // Calcular total
  this.total = this.subtotal + this.impuestos - this.descuento;

  next();
});

export const Factura = model('Factura', facturaSchema);
