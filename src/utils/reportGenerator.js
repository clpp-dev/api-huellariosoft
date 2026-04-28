import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores del tema
const primaryColor = '#3B82F6';
const secondaryColor = '#1E40AF';
const grayColor = '#6B7280';
const darkColor = '#1F2937';
const lightGray = '#F3F4F6';

/**
 * Genera el encabezado común para todos los reportes
 */
const generateHeader = (doc, reportTitle, fechaInicio, fechaFin) => {
  // Logo
  const logoPath = join(__dirname, '../assets/logo.png');
  try {
    doc.image(logoPath, 50, 45, { width: 100 });
  } catch (err) {
    console.log('Logo no encontrado, continuando sin logo');
  }

  // Información de la empresa
  doc.fontSize(18)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('HuellarioSoft', 160, 50);
  
  doc.fontSize(8)
     .fillColor(grayColor)
     .font('Helvetica')
     .text('Sistema de Gestión Veterinaria', 160, 70)
     .text('Cel: 3103811650 / 3042780151', 160, 82);

  // Título del reporte
  doc.fontSize(24)
     .fillColor(secondaryColor)
     .font('Helvetica-Bold')
     .text(reportTitle, 50, 120, { align: 'center' });

  // Rango de fechas
  doc.fontSize(10)
     .fillColor(darkColor)
     .font('Helvetica')
     .text(
       `Período: ${new Date(fechaInicio).toLocaleDateString('es-CO')} - ${new Date(fechaFin).toLocaleDateString('es-CO')}`,
       50,
       155,
       { align: 'center' }
     );

  // Fecha de generación
  doc.fontSize(8)
     .fillColor(grayColor)
     .text(
       `Generado el: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}`,
       50,
       170,
       { align: 'center' }
     );

  // Línea separadora
  doc.moveTo(50, 190)
     .lineTo(562, 190)
     .strokeColor(lightGray)
     .lineWidth(2)
     .stroke();

  return 210; // Retorna la posición Y donde continuar
};

/**
 * Genera el footer común para todos los reportes
 */
const generateFooter = (doc) => {
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    
    doc.moveTo(50, 720)
       .lineTo(562, 720)
       .strokeColor(lightGray)
       .lineWidth(1)
       .stroke();

    doc.fontSize(7)
       .fillColor(grayColor)
       .font('Helvetica')
       .text(
         'HuellarioSoft - Sistema de Gestión Veterinaria',
         50,
         730,
         { align: 'center', width: 512 }
       )
       .text(
         `Página ${i + 1} de ${pageCount}`,
         50,
         742,
         { align: 'center', width: 512 }
       );
  }
};

/**
 * Genera un reporte PDF de facturación
 */
export const generateFacturacionReport = (data, stream) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'letter',
        margin: 50,
        bufferPages: true
      });

      doc.pipe(stream);

      let yPosition = generateHeader(doc, 'REPORTE DE FACTURACIÓN', data.fechaInicio, data.fechaFin);

      // Resumen de estadísticas
      yPosition += 10;
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('RESUMEN GENERAL', 50, yPosition);

      yPosition += 25;
      
      // Tarjetas de estadísticas
      const cardWidth = 150;
      const cardHeight = 60;
      const gap = 20;

      // Total Facturas
      doc.roundedRect(50, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Total Facturas', 60, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text(data.totalFacturas.toString(), 60, yPosition + 30, { width: cardWidth - 20 });

      // Facturas Pagadas
      doc.roundedRect(50 + cardWidth + gap, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Facturas Pagadas', 60 + cardWidth + gap, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#10B981')
         .font('Helvetica-Bold')
         .text(data.facturasPagadas.toString(), 60 + cardWidth + gap, yPosition + 30, { width: cardWidth - 20 });

      // Total Facturado
      doc.roundedRect(50 + (cardWidth + gap) * 2, yPosition, cardWidth + 42, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Total Facturado', 60 + (cardWidth + gap) * 2, yPosition + 10, { width: cardWidth + 22 });
      doc.fontSize(16)
         .fillColor('#059669')
         .font('Helvetica-Bold')
         .text(`$${data.totalFacturado.toLocaleString('es-CO')}`, 60 + (cardWidth + gap) * 2, yPosition + 32, { width: cardWidth + 22 });

      yPosition += cardHeight + 30;

      // Tabla de facturas
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DETALLE DE FACTURAS', 50, yPosition);

      yPosition += 25;

      // Encabezado de tabla
      doc.roundedRect(50, yPosition, 512, 25, 3)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fontSize(8)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('N° FACTURA', 60, yPosition + 8, { width: 70 })
         .text('FECHA', 135, yPosition + 8, { width: 65 })
         .text('CLIENTE', 205, yPosition + 8, { width: 140 })
         .text('ESTADO', 350, yPosition + 8, { width: 70 })
         .text('TOTAL', 425, yPosition + 8, { width: 125, align: 'right' });

      yPosition += 35;
      let isAlternate = false;

      data.facturas.forEach((factura) => {
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        if (isAlternate) {
          doc.roundedRect(50, yPosition - 5, 512, 22, 2)
             .fillAndStroke(lightGray, lightGray);
        }
        isAlternate = !isAlternate;

        const estadoLabel = factura.estado === 'pagada-presencial' ? 'Pagada' : 
                           factura.estado === 'anulada' ? 'Anulada' : 'Pendiente';

        doc.fontSize(8)
           .fillColor(darkColor)
           .font('Helvetica')
           .text(factura.numeroFactura || 'N/A', 60, yPosition, { width: 70 })
           .text(new Date(factura.fecha).toLocaleDateString('es-CO'), 135, yPosition, { width: 65 })
           .text(factura.propietario?.nombreCompleto || 'N/A', 205, yPosition, { width: 140, ellipsis: true })
           .text(estadoLabel, 350, yPosition, { width: 70 })
           .font('Helvetica-Bold')
           .text(`$${factura.total.toLocaleString('es-CO')}`, 425, yPosition, { width: 125, align: 'right' });

        yPosition += 22;
      });

      generateFooter(doc);
      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Genera un reporte PDF de citas
 */
export const generateCitasReport = (data, stream) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'letter',
        margin: 50,
        bufferPages: true
      });

      doc.pipe(stream);

      let yPosition = generateHeader(doc, 'REPORTE DE CITAS', data.fechaInicio, data.fechaFin);

      // Resumen de estadísticas
      yPosition += 10;
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('RESUMEN GENERAL', 50, yPosition);

      yPosition += 25;
      
      const cardWidth = 120;
      const cardHeight = 60;
      const gap = 20;

      // Total Citas
      doc.roundedRect(50, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Total Citas', 60, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text(data.totalCitas.toString(), 60, yPosition + 30, { width: cardWidth - 20 });

      // Confirmadas
      doc.roundedRect(50 + cardWidth + gap, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Confirmadas', 60 + cardWidth + gap, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#10B981')
         .font('Helvetica-Bold')
         .text(data.confirmadas.toString(), 60 + cardWidth + gap, yPosition + 30, { width: cardWidth - 20 });

      // Completadas
      doc.roundedRect(50 + (cardWidth + gap) * 2, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Completadas', 60 + (cardWidth + gap) * 2, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#059669')
         .font('Helvetica-Bold')
         .text(data.completadas.toString(), 60 + (cardWidth + gap) * 2, yPosition + 30, { width: cardWidth - 20 });

      // Canceladas
      doc.roundedRect(50 + (cardWidth + gap) * 3, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Canceladas', 60 + (cardWidth + gap) * 3, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#EF4444')
         .font('Helvetica-Bold')
         .text(data.canceladas.toString(), 60 + (cardWidth + gap) * 3, yPosition + 30, { width: cardWidth - 20 });

      yPosition += cardHeight + 30;

      // Tabla de citas
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DETALLE DE CITAS', 50, yPosition);

      yPosition += 25;

      // Encabezado de tabla
      doc.roundedRect(50, yPosition, 512, 25, 3)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fontSize(8)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('FECHA', 60, yPosition + 8, { width: 65 })
         .text('HORA', 130, yPosition + 8, { width: 45 })
         .text('MASCOTA', 180, yPosition + 8, { width: 90 })
         .text('PROPIETARIO', 275, yPosition + 8, { width: 110 })
         .text('MOTIVO', 390, yPosition + 8, { width: 90 })
         .text('ESTADO', 485, yPosition + 8, { width: 65 });

      yPosition += 35;
      let isAlternate = false;

      data.citas.forEach((cita) => {
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        if (isAlternate) {
          doc.roundedRect(50, yPosition - 5, 512, 22, 2)
             .fillAndStroke(lightGray, lightGray);
        }
        isAlternate = !isAlternate;

        const estadoLabel = cita.estado === 'confirmada' ? 'Confirmada' : 
                           cita.estado === 'completada' ? 'Completada' :
                           cita.estado === 'cancelada' ? 'Cancelada' : 'Pendiente';

        doc.fontSize(8)
           .fillColor(darkColor)
           .font('Helvetica')
           .text(new Date(cita.fecha).toLocaleDateString('es-CO'), 60, yPosition, { width: 65 })
           .text(cita.hora, 130, yPosition, { width: 45 })
           .text(cita.mascota?.nombre || 'N/A', 180, yPosition, { width: 90, ellipsis: true })
           .text(cita.propietario?.nombreCompleto || 'N/A', 275, yPosition, { width: 110, ellipsis: true })
           .text(cita.motivo || 'N/A', 390, yPosition, { width: 90, ellipsis: true })
           .text(estadoLabel, 485, yPosition, { width: 65 });

        yPosition += 22;
      });

      generateFooter(doc);
      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Genera un reporte PDF de mascotas registradas
 */
export const generateMascotasReport = (data, stream) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'letter',
        margin: 50,
        bufferPages: true
      });

      doc.pipe(stream);

      let yPosition = generateHeader(doc, 'REPORTE DE MASCOTAS REGISTRADAS', data.fechaInicio, data.fechaFin);

      // Resumen de estadísticas
      yPosition += 10;
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('RESUMEN GENERAL', 50, yPosition);

      yPosition += 25;
      
      const cardWidth = 150;
      const cardHeight = 60;
      const gap = 30;

      // Total Mascotas
      doc.roundedRect(50, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Total Registradas', 60, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text(data.totalMascotas.toString(), 60, yPosition + 30, { width: cardWidth - 20 });

      // Por Especie
      doc.roundedRect(50 + cardWidth + gap, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Caninos', 60 + cardWidth + gap, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#10B981')
         .font('Helvetica-Bold')
         .text(data.porEspecie.canino || 0, 60 + cardWidth + gap, yPosition + 30, { width: cardWidth - 20 });

      doc.roundedRect(50 + (cardWidth + gap) * 2, yPosition, cardWidth, cardHeight, 5)
         .fillAndStroke(lightGray, lightGray);
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Felinos', 60 + (cardWidth + gap) * 2, yPosition + 10, { width: cardWidth - 20 });
      doc.fontSize(18)
         .fillColor('#F59E0B')
         .font('Helvetica-Bold')
         .text(data.porEspecie.felino || 0, 60 + (cardWidth + gap) * 2, yPosition + 30, { width: cardWidth - 20 });

      yPosition += cardHeight + 30;

      // Tabla de mascotas
      doc.fontSize(12)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DETALLE DE MASCOTAS', 50, yPosition);

      yPosition += 25;

      // Encabezado de tabla
      doc.roundedRect(50, yPosition, 512, 25, 3)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fontSize(8)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('NOMBRE', 60, yPosition + 8, { width: 100 })
         .text('ESPECIE', 165, yPosition + 8, { width: 60 })
         .text('RAZA', 230, yPosition + 8, { width: 80 })
         .text('PROPIETARIO', 315, yPosition + 8, { width: 120 })
         .text('FECHA REG.', 440, yPosition + 8, { width: 110, align: 'right' });

      yPosition += 35;
      let isAlternate = false;

      data.mascotas.forEach((mascota) => {
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        if (isAlternate) {
          doc.roundedRect(50, yPosition - 5, 512, 22, 2)
             .fillAndStroke(lightGray, lightGray);
        }
        isAlternate = !isAlternate;

        doc.fontSize(8)
           .fillColor(darkColor)
           .font('Helvetica-Bold')
           .text(mascota.nombre || 'N/A', 60, yPosition, { width: 100, ellipsis: true })
           .font('Helvetica')
           .text(mascota.especie || 'N/A', 165, yPosition, { width: 60 })
           .text(mascota.raza || 'N/A', 230, yPosition, { width: 80, ellipsis: true })
           .text(mascota.propietario?.nombreCompleto || 'N/A', 315, yPosition, { width: 120, ellipsis: true })
           .text(new Date(mascota.createdAt).toLocaleDateString('es-CO'), 440, yPosition, { width: 110, align: 'right' });

        yPosition += 22;
      });

      generateFooter(doc);
      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

const getMetodoPagoLabel = (metodo) => {
  const labels = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'otro': 'Otro'
  };
  return labels[metodo] || metodo;
};
