import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

/**
 * Servicio de envío de emails
 * Maneja el envío de correos electrónicos usando Nodemailer
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializa el transportador de Nodemailer
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure, // true para 465, false para otros puertos
        auth: {
          user: config.mail.auth.user,
          pass: config.mail.auth.pass,
        },
      });

      console.log('✉️  Servicio de email inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar servicio de email:', error);
    }
  }

  /**
   * Envía un email de recuperación de contraseña
   * @param {string} to - Email del destinatario
   * @param {string} resetToken - Token de recuperación
   * @param {string} userName - Nombre del usuario
   */
  async sendPasswordResetEmail(to, resetToken, userName) {
    try {
      // URL del frontend para resetear contraseña
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: config.mail.from,
        to,
        subject: 'Recuperación de Contraseña - HuellarioSoft',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .button {
                display: inline-block;
                background: #3B82F6;
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                border-radius: 0 0 10px 10px;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🐾 HuellarioSoft</h1>
              <p>Sistema de Gestión Veterinaria</p>
            </div>
            
            <div class="content">
              <h2>Hola ${userName},</h2>
              
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
              
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="background: white; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
              </div>
              
              <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
              
              <p>Saludos,<br>El equipo de HuellarioSoft</p>
            </div>
            
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; ${new Date().getFullYear()} HuellarioSoft. Todos los derechos reservados.</p>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de recuperación enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error);
      throw error;
    }
  }

  /**
   * Envía un email de confirmación de cambio de contraseña
   * @param {string} to - Email del destinatario
   * @param {string} userName - Nombre del usuario
   */
  async sendPasswordChangedEmail(to, userName) {
    try {
      const mailOptions = {
        from: config.mail.from,
        to,
        subject: 'Contraseña Actualizada - HuellarioSoft',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .footer {
                background: #1f2937;
                color: #9ca3af;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                border-radius: 0 0 10px 10px;
              }
              .success-icon {
                font-size: 48px;
                text-align: center;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🐾 HuellarioSoft</h1>
              <p>Sistema de Gestión Veterinaria</p>
            </div>
            
            <div class="content">
              <div class="success-icon">✅</div>
              
              <h2>Hola ${userName},</h2>
              
              <p>Te confirmamos que tu contraseña ha sido actualizada exitosamente.</p>
              
              <p>Si no realizaste este cambio, por favor contacta inmediatamente con el administrador del sistema.</p>
              
              <p>Saludos,<br>El equipo de HuellarioSoft</p>
            </div>
            
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; ${new Date().getFullYear()} HuellarioSoft. Todos los derechos reservados.</p>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmación enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
      throw error;
    }
  }

  /**
   * Verifica la configuración del transportador
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión con servidor de email verificada');
      return true;
    } catch (error) {
      console.error('❌ Error al verificar conexión de email:', error);
      return false;
    }
  }
}

export default new EmailService();
