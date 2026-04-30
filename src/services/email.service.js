import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

      // Ruta del logo
      const logoPath = path.join(__dirname, '../assets/logo.png');

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
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                background-color: #f3f4f6;
                padding: 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1E40AF 100%);
                padding: 40px 30px;
                text-align: center;
              }
              .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 15px;
              }
              .header h1 {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header p {
                color: #E0E7FF;
                font-size: 16px;
                font-weight: 400;
              }
              .content {
                padding: 40px 30px;
                background: white;
                color: #1f2937;
              }
              .content h2 {
                color: #111827;
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: 600;
              }
              .content p {
                color: #374151;
                font-size: 16px;
                margin-bottom: 16px;
                line-height: 1.7;
              }
              .button-container {
                text-align: center;
                margin: 30px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
                color: white !important;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
                transition: all 0.3s ease;
              }
              .button:hover {
                box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
                transform: translateY(-2px);
              }
              .url-box {
                background: #F3F4F6;
                border: 1px solid #E5E7EB;
                padding: 15px;
                border-radius: 8px;
                word-break: break-all;
                color: #3B82F6;
                font-size: 14px;
                margin: 20px 0;
              }
              .warning {
                background: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 16px;
                margin: 25px 0;
                border-radius: 6px;
              }
              .warning strong {
                color: #92400E;
                font-size: 16px;
              }
              .warning-text {
                color: #78350F;
                margin-top: 4px;
                font-size: 14px;
              }
              .footer {
                background: #111827;
                color: #D1D5DB;
                padding: 30px;
                text-align: center;
              }
              .footer p {
                font-size: 13px;
                margin-bottom: 8px;
                color: #9CA3AF;
              }
              .footer-links {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #374151;
              }
              .divider {
                height: 1px;
                background: #E5E7EB;
                margin: 25px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <img src="cid:logo" alt="HuellarioSoft Logo" class="logo" />
                <h1>HuellarioSoft</h1>
                <p>Sistema de Gestión Veterinaria</p>
              </div>
              
              <div class="content">
                <h2>Hola ${userName},</h2>
                
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en HuellarioSoft.</p>
                
                <p>Para continuar con el proceso, haz clic en el siguiente botón y podrás crear una nueva contraseña segura:</p>
                
                <div class="button-container">
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #6B7280;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <div class="url-box">${resetUrl}</div>
                
                <div class="warning">
                  <strong>⚠️ Importante</strong>
                  <p class="warning-text">Este enlace expirará en 1 hora por seguridad.</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #6B7280;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.</p>
                
                <p style="margin-top: 30px; color: #111827; font-weight: 500;">Saludos,<br>El equipo de HuellarioSoft 🐾</p>
              </div>
              
              <div class="footer">
                <p><strong>HuellarioSoft</strong> - Sistema de Gestión Veterinaria</p>
                <div class="footer-links">
                  <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                  <p>&copy; ${new Date().getFullYear()} HuellarioSoft. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo', // mismo CID usado en el src de la imagen
          },
        ],
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
      // Ruta del logo
      const logoPath = path.join(__dirname, '../assets/logo.png');

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
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                background-color: #f3f4f6;
                padding: 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                padding: 40px 30px;
                text-align: center;
              }
              .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 15px;
              }
              .header h1 {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header p {
                color: #D1FAE5;
                font-size: 16px;
                font-weight: 400;
              }
              .content {
                padding: 40px 30px;
                background: white;
                color: #1f2937;
              }
              .success-badge {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 30px;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
              }
              .success-badge svg {
                width: 45px;
                height: 45px;
                color: white;
              }
              .content h2 {
                color: #111827;
                font-size: 24px;
                margin-bottom: 20px;
                font-weight: 600;
              }
              .content p {
                color: #374151;
                font-size: 16px;
                margin-bottom: 16px;
                line-height: 1.7;
              }
              .alert-box {
                background: #FEE2E2;
                border-left: 4px solid #EF4444;
                padding: 16px;
                margin: 25px 0;
                border-radius: 6px;
              }
              .alert-box strong {
                color: #991B1B;
                font-size: 16px;
                display: block;
                margin-bottom: 4px;
              }
              .alert-box p {
                color: #7F1D1D;
                margin: 0;
                font-size: 14px;
              }
              .footer {
                background: #111827;
                color: #D1D5DB;
                padding: 30px;
                text-align: center;
              }
              .footer p {
                font-size: 13px;
                margin-bottom: 8px;
                color: #9CA3AF;
              }
              .footer-links {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #374151;
              }
              .divider {
                height: 1px;
                background: #E5E7EB;
                margin: 25px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <img src="cid:logo" alt="HuellarioSoft Logo" class="logo" />
                <h1>HuellarioSoft</h1>
                <p>Sistema de Gestión Veterinaria</p>
              </div>
              
              <div class="content">
                <div class="success-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2>Contraseña Actualizada Exitosamente</h2>
                
                <p>Hola ${userName},</p>
                
                <p>Te confirmamos que tu contraseña en HuellarioSoft ha sido actualizada correctamente.</p>
                
                <p style="color: #059669; font-weight: 500; background: #D1FAE5; padding: 12px; border-radius: 6px; text-align: center; margin: 20px 0;">
                  ✓ Tu cuenta está segura y puedes acceder con tu nueva contraseña
                </p>
                
                <div class="divider"></div>
                
                <div class="alert-box">
                  <strong>⚠️ ¿No reconoces este cambio?</strong>
                  <p>Si no realizaste este cambio, por favor contacta inmediatamente con el administrador del sistema para proteger tu cuenta.</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="margin-top: 30px; color: #111827; font-weight: 500;">Saludos,<br>El equipo de HuellarioSoft 🐾</p>
              </div>
              
              <div class="footer">
                <p><strong>HuellarioSoft</strong> - Sistema de Gestión Veterinaria</p>
                <div class="footer-links">
                  <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                  <p>&copy; ${new Date().getFullYear()} HuellarioSoft. Todos los derechos reservados.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo',
          },
        ],
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
