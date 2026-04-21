import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración centralizada de la aplicación
 * Todas las variables de entorno se acceden desde aquí
 */
export const config = {
  // Configuración del servidor
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  
  // Configuración de MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  
  // Configuración de bcrypt
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  },
  
  // Configuración de CORS
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(','),
  },
  
  // Configuración de Nodemailer
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    from: process.env.MAIL_FROM,
  },
  
  // Configuración de uploads
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp'
    ],
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ],
  },
};
