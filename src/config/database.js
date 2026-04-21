import mongoose from 'mongoose';
import { config } from './config.js';

/**
 * Conexión a MongoDB usando Mongoose
 * Implementa retry logic y manejo de eventos
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    // Reintentar conexión después de 5 segundos
    console.log('⏳ Reintentando conexión en 5 segundos...');
    setTimeout(connectDB, 5000);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 Conexión MongoDB cerrada por terminación de aplicación');
  process.exit(0);
});
