import { asyncHandler } from '../utils/asyncHandler.js';
import reporteService from '../services/reporte.service.js';
import { 
  generateFacturacionReport, 
  generateCitasReport, 
  generateMascotasReport 
} from '../utils/reportGenerator.js';
import { successResponse } from '../utils/responses.js';

class ReporteController {
  /**
   * Genera reporte de facturación en PDF
   * GET /api/reportes/facturacion/pdf
   */
  generarReporteFacturacion = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteFacturacion(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Configurar headers para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-facturacion-${fechas.fechaInicio}-${fechas.fechaFin}.pdf`
    );

    // Generar y enviar PDF
    await generateFacturacionReport(data, res);
  });

  /**
   * Genera reporte de citas en PDF
   * GET /api/reportes/citas/pdf
   */
  generarReporteCitas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteCitas(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Configurar headers para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-citas-${fechas.fechaInicio}-${fechas.fechaFin}.pdf`
    );

    // Generar y enviar PDF
    await generateCitasReport(data, res);
  });

  /**
   * Genera reporte de mascotas registradas en PDF
   * GET /api/reportes/mascotas/pdf
   */
  generarReporteMascotas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteMascotas(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Configurar headers para PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-mascotas-${fechas.fechaInicio}-${fechas.fechaFin}.pdf`
    );

    // Generar y enviar PDF
    await generateMascotasReport(data, res);
  });

  /**
   * Obtiene vista previa de estadísticas de facturación
   * GET /api/reportes/facturacion/preview
   */
  getPreviewFacturacion = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteFacturacion(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Enviar solo las estadísticas (sin la lista completa)
    successResponse(res, {
      totalFacturas: data.totalFacturas,
      facturasPagadas: data.facturasPagadas,
      totalFacturado: data.totalFacturado,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    });
  });

  /**
   * Obtiene vista previa de estadísticas de citas
   * GET /api/reportes/citas/preview
   */
  getPreviewCitas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteCitas(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Enviar solo las estadísticas (sin la lista completa)
    successResponse(res, {
      totalCitas: data.totalCitas,
      programadas: data.programadas,
      completadas: data.completadas,
      canceladas: data.canceladas,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    });
  });

  /**
   * Obtiene vista previa de estadísticas de mascotas
   * GET /api/reportes/mascotas/preview
   */
  getPreviewMascotas = asyncHandler(async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar y ajustar fechas
    const fechas = reporteService.validarFechas(fechaInicio, fechaFin);

    // Obtener datos del reporte
    const data = await reporteService.getReporteMascotas(
      fechas.fechaInicio,
      fechas.fechaFin
    );

    // Enviar solo las estadísticas (sin la lista completa)
    successResponse(res, {
      totalMascotas: data.totalMascotas,
      porEspecie: data.porEspecie,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    });
  });
}

export default new ReporteController();
