import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Genera un PDF de factura con diseño profesional
 */
export const generateInvoicePDF = (invoice, stream) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'letter',
        margin: 50,
        bufferPages: true
      });

      // Pipe al stream
      doc.pipe(stream);

      // Colores del tema
      const primaryColor = '#3B82F6';
      const secondaryColor = '#1E40AF';
      const grayColor = '#6B7280';
      const darkColor = '#1F2937';
      const lightGray = '#F3F4F6';

      // Logo y Header
      const logoPath = join(__dirname, '../assets/logo.png');
      try {
        doc.image(logoPath, 50, 45, { width: 60 });
      } catch (err) {
        console.log('Logo no encontrado, continuando sin logo');
      }

      // Información de la empresa
      doc.fontSize(20)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('HuellarioSoft', 120, 50);
      
      doc.fontSize(9)
         .fillColor(grayColor)
         .font('Helvetica')
         .text('Sistema de Gestión Veterinaria', 120, 73)
         .text('Cel: 3103811650 / 3042780151', 120, 86)
         .text('https://animalhealt-huellariosoft.clperez341.workers.dev/', 120, 99);

      // Título FACTURA
      doc.fontSize(28)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('FACTURA', 400, 50, { align: 'right' });

      // Número de factura y fecha
      doc.fontSize(10)
         .fillColor(darkColor)
         .font('Helvetica')
         .text(`No. ${invoice.numeroFactura || 'N/A'}`, 400, 85, { align: 'right' });
      
      doc.fontSize(9)
         .fillColor(grayColor)
         .text(`Fecha: ${new Date(invoice.fecha).toLocaleDateString('es-CO')}`, 400, 100, { align: 'right' });

      // Estado de la factura
      const estadoLabel = invoice.estado === 'pagada-presencial' ? 'PAGADA' : 
                         invoice.estado === 'anulada' ? 'ANULADA' : 'PENDIENTE';
      const estadoColor = invoice.estado === 'pagada-presencial' ? '#10B981' : 
                         invoice.estado === 'anulada' ? '#EF4444' : '#F59E0B';
      
      doc.roundedRect(485, 115, 80, 25, 3)
         .fillAndStroke(estadoColor, estadoColor);
      
      doc.fontSize(9)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text(estadoLabel, 485, 123, { width: 80, align: 'center' });

      // Línea separadora
      doc.moveTo(50, 160)
         .lineTo(562, 160)
         .strokeColor(lightGray)
         .lineWidth(2)
         .stroke();

      // Información del cliente
      const yStart = 180;
      doc.fontSize(11)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DATOS DEL CLIENTE', 50, yStart);

      doc.roundedRect(50, yStart + 15, 250, 90, 5)
         .fillAndStroke(lightGray, lightGray);

      doc.fontSize(9)
         .fillColor(darkColor)
         .font('Helvetica-Bold')
         .text('Propietario:', 60, yStart + 25);
      
      doc.font('Helvetica')
         .text(invoice.propietario?.nombreCompleto || 'N/A', 60, yStart + 40, { width: 230 });

      doc.font('Helvetica-Bold')
         .text('Teléfono:', 60, yStart + 60);
      
      doc.font('Helvetica')
         .text(invoice.propietario?.telefono || 'N/A', 120, yStart + 60);

      doc.font('Helvetica-Bold')
         .text('Email:', 60, yStart + 75);
      
      doc.font('Helvetica')
         .text(invoice.propietario?.email || 'N/A', 100, yStart + 75, { width: 190 });

      // Información de la mascota
      doc.fontSize(11)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DATOS DE LA MASCOTA', 320, yStart);

      doc.roundedRect(320, yStart + 15, 242, 90, 5)
         .fillAndStroke(lightGray, lightGray);

      doc.fontSize(9)
         .fillColor(darkColor)
         .font('Helvetica-Bold')
         .text('Mascota:', 330, yStart + 25);
      
      doc.font('Helvetica')
         .text(invoice.mascota?.nombre || 'N/A', 330, yStart + 40);

      doc.font('Helvetica-Bold')
         .text('Especie:', 330, yStart + 60);
      
      doc.font('Helvetica')
         .text(invoice.mascota?.especie || 'N/A', 380, yStart + 60);

      doc.font('Helvetica-Bold')
         .text('Raza:', 330, yStart + 75);
      
      doc.font('Helvetica')
         .text(invoice.mascota?.raza || 'N/A', 365, yStart + 75);

      // Tabla de servicios
      const tableTop = yStart + 120;
      
      doc.fontSize(11)
         .fillColor(secondaryColor)
         .font('Helvetica-Bold')
         .text('DETALLE DE SERVICIOS', 50, tableTop);

      // Encabezado de tabla
      const headerY = tableTop + 20;
      doc.roundedRect(50, headerY, 512, 25, 3)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fontSize(9)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('DESCRIPCIÓN', 60, headerY + 8, { width: 220 })
         .text('CANT.', 290, headerY + 8, { width: 50, align: 'center' })
         .text('P. UNITARIO', 350, headerY + 8, { width: 70, align: 'right' })
         .text('SUBTOTAL', 430, headerY + 8, { width: 120, align: 'right' });

      // Filas de servicios
      let yPosition = headerY + 35;
      const lineHeight = 25;
      let isAlternate = false;

      invoice.servicios.forEach((servicio, index) => {
        // Verificar si necesitamos una nueva página
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        // Fila alternada
        if (isAlternate) {
          doc.roundedRect(50, yPosition - 5, 512, lineHeight, 2)
             .fillAndStroke(lightGray, lightGray);
        }
        isAlternate = !isAlternate;

        doc.fontSize(9)
           .fillColor(darkColor)
           .font('Helvetica')
           .text(servicio.descripcion, 60, yPosition, { width: 220, height: lineHeight - 5 })
           .text(servicio.cantidad.toString(), 290, yPosition, { width: 50, align: 'center' })
           .text(`$${servicio.precioUnitario.toLocaleString('es-CO')}`, 350, yPosition, { width: 70, align: 'right' })
           .font('Helvetica-Bold')
           .text(`$${servicio.subtotal.toLocaleString('es-CO')}`, 430, yPosition, { width: 120, align: 'right' });

        yPosition += lineHeight;
      });

      // Totales
      yPosition += 20;
      const totalsX = 380;
      const totalsLabelX = 280;

      doc.fontSize(10)
         .fillColor(darkColor)
         .font('Helvetica')
         .text('Subtotal:', totalsLabelX, yPosition, { width: 90, align: 'right' })
         .text(`$${invoice.subtotal.toLocaleString('es-CO')}`, totalsX, yPosition, { width: 170, align: 'right' });

      yPosition += 20;
      if (invoice.descuento > 0) {
        doc.fillColor('#DC2626')
           .text('Descuento:', totalsLabelX, yPosition, { width: 90, align: 'right' })
           .text(`-$${invoice.descuento.toLocaleString('es-CO')}`, totalsX, yPosition, { width: 170, align: 'right' });
        yPosition += 20;
      }

      doc.fillColor(darkColor)
         .text(`IVA (${invoice.porcentajeImpuestos || 0}%):`, totalsLabelX, yPosition, { width: 90, align: 'right' })
         .text(`$${invoice.impuestos.toLocaleString('es-CO')}`, totalsX, yPosition, { width: 170, align: 'right' });

      yPosition += 15;
      doc.roundedRect(totalsLabelX, yPosition, 282, 30, 5)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fontSize(12)
         .fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .text('TOTAL:', totalsLabelX + 10, yPosition + 9, { width: 90, align: 'right' })
         .fontSize(14)
         .text(`$${invoice.total.toLocaleString('es-CO')}`, totalsX + 10, yPosition + 8, { width: 160, align: 'right' });

      // Información de pago
      if (invoice.metodoPago) {
        yPosition += 50;
        doc.fontSize(9)
           .fillColor(grayColor)
           .font('Helvetica')
           .text(`Método de pago: ${getMetodoPagoLabel(invoice.metodoPago)}`, 50, yPosition);
        
        if (invoice.fechaPago) {
          doc.text(`Fecha de pago: ${new Date(invoice.fechaPago).toLocaleString('es-CO')}`, 250, yPosition);
        }
      }

      // Observaciones
      if (invoice.observaciones) {
        yPosition += 30;
        doc.fontSize(9)
           .fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .text('OBSERVACIONES:', 50, yPosition);
        
        yPosition += 15;
        doc.fontSize(8)
           .fillColor(darkColor)
           .font('Helvetica')
           .text(invoice.observaciones, 50, yPosition, { width: 512, align: 'justify' });
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Línea superior del footer
        doc.moveTo(50, 720)
           .lineTo(562, 720)
           .strokeColor(lightGray)
           .lineWidth(1)
           .stroke();

        doc.fontSize(7)
           .fillColor(grayColor)
           .font('Helvetica')
           .text(
             'Gracias por confiar en HuellarioSoft - Sistema de Gestión Veterinaria',
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

      doc.end();

      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Obtiene el label del método de pago
 */
function getMetodoPagoLabel(metodo) {
  const labels = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'otro': 'Otro'
  };
  return labels[metodo] || metodo;
}
