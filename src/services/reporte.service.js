import { Factura } from '../models/Factura.js';
import { Cita } from '../models/Cita.js';
import { Mascota } from '../models/Mascota.js';

/**
 * Servicio de reportes
 * Maneja la generación de reportes estadísticos
 */
class ReporteService {
  /**
   * Obtiene los datos para el reporte de facturación
   */
  async getReporteFacturacion(fechaInicio, fechaFin) {
    const query = {
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
    };

    const [facturas, totalFacturas, facturasPagadas] = await Promise.all([
      Factura.find(query)
        .populate('propietario', 'nombreCompleto documento')
        .sort({ fecha: -1 })
        .lean(),
      Factura.countDocuments(query),
      Factura.countDocuments({
        ...query,
        estado: 'pagada-presencial',
      }),
    ]);

    // Calcular total facturado (solo facturas pagadas)
    const totalFacturado = facturas
      .filter((f) => f.estado === 'pagada-presencial')
      .reduce((sum, f) => sum + f.total, 0);

    return {
      facturas,
      totalFacturas,
      facturasPagadas,
      totalFacturado,
      fechaInicio,
      fechaFin,
    };
  }

  /**
   * Obtiene los datos para el reporte de citas
   */
  async getReporteCitas(fechaInicio, fechaFin) {
    const query = {
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
    };

    const [citas, totalCitas] = await Promise.all([
      Cita.find(query)
        .populate('mascota', 'nombre especie')
        .populate('propietario', 'nombreCompleto')
        .sort({ fecha: -1, hora: -1 })
        .lean(),
      Cita.countDocuments(query),
    ]);

    // Contar por estado
    const confirmadas = citas.filter((c) => c.estado === 'confirmada').length;
    const completadas = citas.filter((c) => c.estado === 'completada').length;
    const canceladas = citas.filter((c) => c.estado === 'cancelada').length;
    const pendientes = citas.filter((c) => c.estado === 'pendiente').length;

    return {
      citas,
      totalCitas,
      confirmadas,
      completadas,
      canceladas,
      pendientes,
      fechaInicio,
      fechaFin,
    };
  }

  /**
   * Obtiene los datos para el reporte de mascotas registradas
   */
  async getReporteMascotas(fechaInicio, fechaFin) {
    const query = {
      createdAt: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
      activo: true,
    };

    const [mascotas, totalMascotas] = await Promise.all([
      Mascota.find(query)
        .populate('propietario', 'nombreCompleto')
        .sort({ createdAt: -1 })
        .lean(),
      Mascota.countDocuments(query),
    ]);

    // Agrupar por especie
    const porEspecie = {
      canino: mascotas.filter((m) => m.especie === 'canino').length,
      felino: mascotas.filter((m) => m.especie === 'felino').length,
      ave: mascotas.filter((m) => m.especie === 'ave').length,
      reptil: mascotas.filter((m) => m.especie === 'reptil').length,
      roedor: mascotas.filter((m) => m.especie === 'roedor').length,
      otro: mascotas.filter((m) => m.especie === 'otro').length,
    };

    return {
      mascotas,
      totalMascotas,
      porEspecie,
      fechaInicio,
      fechaFin,
    };
  }

  /**
   * Valida y ajusta las fechas del reporte
   * Si no se proporcionan fechas, usa el mes actual
   */
  validarFechas(fechaInicio, fechaFin) {
    let inicio = fechaInicio;
    let fin = fechaFin;

    // Si no hay fechas, usar el mes actual
    if (!inicio || !fin) {
      const ahora = new Date();
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
      fin = ahora.toISOString().split('T')[0];
    }

    // Validar que la fecha de inicio no sea mayor que la fecha fin
    if (new Date(inicio) > new Date(fin)) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha fin');
    }

    return { fechaInicio: inicio, fechaFin: fin };
  }
}

export default new ReporteService();
