import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

/**
 * Crear aplicación Express
 */
const app = express();

/**
 * Middlewares globales
 */

// Logs de peticiones HTTP
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos estáticos (uploads)
app.use('/uploads', express.static('src/uploads'));

/**
 * Rutas
 */
app.use('/api', routes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

/**
 * Middleware para rutas no encontradas (404)
 */
app.use(notFound);

/**
 * Middleware global de manejo de errores
 */
app.use(errorHandler);

export default app;
