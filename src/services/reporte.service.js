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
    // Crear fechas con hora específica para incluir todo el rango
    // Usar el formato YYYY-MM-DD para evitar problemas de zona horaria
    const [yearInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
    const fechaInicioDate = new Date(yearInicio, mesInicio - 1, diaInicio, 0, 0, 0, 0);
    
    const [yearFin, mesFin, diaFin] = fechaFin.split('-').map(Number);
    const fechaFinDate = new Date(yearFin, mesFin - 1, diaFin, 23, 59, 59, 999);

    const query = {
      fecha: {
        $gte: fechaInicioDate,
        $lte: fechaFinDate,
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
    // Crear fechas con hora específica para incluir todo el rango
    // Usar el formato YYYY-MM-DD para evitar problemas de zona horaria
    const [yearInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
    const fechaInicioDate = new Date(yearInicio, mesInicio - 1, diaInicio, 0, 0, 0, 0);
    
    const [yearFin, mesFin, diaFin] = fechaFin.split('-').map(Number);
    const fechaFinDate = new Date(yearFin, mesFin - 1, diaFin, 23, 59, 59, 999);

    const query = {
      fecha: {
        $gte: fechaInicioDate,
        $lte: fechaFinDate,
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
    const pendientes = citas.filter((c) => c.estado === 'pendiente').length;
    const agendadas = citas.filter((c) => c.estado === 'agendada').length;
    const confirmadas = citas.filter((c) => c.estado === 'confirmada').length;
    const completadas = citas.filter((c) => c.estado === 'completada').length;
    const canceladas = citas.filter((c) => c.estado === 'cancelada').length;
    const enCurso = citas.filter((c) => c.estado === 'en-curso').length;
    const noAsistio = citas.filter((c) => c.estado === 'no-asistio').length;

    return {
      citas,
      totalCitas,
      pendientes,
      agendadas,
      confirmadas,
      completadas,
      canceladas,
      enCurso,
      noAsistio,
      fechaInicio,
      fechaFin,
    };
  }

  /**
   * Obtiene los datos para el reporte de mascotas registradas
   */
  async getReporteMascotas(fechaInicio, fechaFin) {
    // Crear fechas con hora específica para incluir todo el rango
    // Usar el formato YYYY-MM-DD para evitar problemas de zona horaria
    const [yearInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
    const fechaInicioDate = new Date(yearInicio, mesInicio - 1, diaInicio, 0, 0, 0, 0);
    
    const [yearFin, mesFin, diaFin] = fechaFin.split('-').map(Number);
    const fechaFinDate = new Date(yearFin, mesFin - 1, diaFin, 23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: fechaInicioDate,
        $lte: fechaFinDate,
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

    // Agrupar por especie (case-insensitive para compatibilidad)
    const porEspecie = {
      canino: mascotas.filter((m) => m.especie?.toLowerCase() === 'canino').length,
      felino: mascotas.filter((m) => m.especie?.toLowerCase() === 'felino').length,
      ave: mascotas.filter((m) => m.especie?.toLowerCase() === 'ave').length,
      reptil: mascotas.filter((m) => m.especie?.toLowerCase() === 'reptil').length,
      roedor: mascotas.filter((m) => m.especie?.toLowerCase() === 'roedor').length,
      otro: mascotas.filter((m) => m.especie?.toLowerCase() === 'otro').length,
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
      
      // Primer día del mes - formatear sin convertir a UTC
      const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const year1 = primerDia.getFullYear();
      const mes1 = String(primerDia.getMonth() + 1).padStart(2, '0');
      const dia1 = String(primerDia.getDate()).padStart(2, '0');
      inicio = `${year1}-${mes1}-${dia1}`;
      
      // Fecha actual - formatear sin convertir a UTC
      const year2 = ahora.getFullYear();
      const mes2 = String(ahora.getMonth() + 1).padStart(2, '0');
      const dia2 = String(ahora.getDate()).padStart(2, '0');
      fin = `${year2}-${mes2}-${dia2}`;
    }

    // Validar que la fecha de inicio no sea mayor que la fecha fin
    const [yearInicio, mesInicio, diaInicio] = inicio.split('-').map(Number);
    const fechaInicioDate = new Date(yearInicio, mesInicio - 1, diaInicio);
    
    const [yearFin, mesFin, diaFin] = fin.split('-').map(Number);
    const fechaFinDate = new Date(yearFin, mesFin - 1, diaFin);
    
    if (fechaInicioDate > fechaFinDate) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha fin');
    }

    return { fechaInicio: inicio, fechaFin: fin };
  }
}

export default new ReporteService();
