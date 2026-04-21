import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';

/**
 * Iniciar servidor
 */
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Iniciar servidor Express
    app.listen(config.port, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                                                       ║');
      console.log('║          🐾 HUELLARIOSOFT API 🐾                     ║');
      console.log('║                                                       ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`🚀 Servidor corriendo en: http://localhost:${config.port}`);
      console.log(`📝 Entorno: ${config.env}`);
      console.log(`🔗 API Base: http://localhost:${config.port}/api`);
      console.log(`💚 Health Check: http://localhost:${config.port}/health`);
      console.log('');
      console.log('📚 Endpoints disponibles:');
      console.log(`   - Auth:              /api/auth`);
      console.log(`   - Usuarios:          /api/users`);
      console.log(`   - Propietarios:      /api/propietarios`);
      console.log(`   - Mascotas:          /api/mascotas`);
      console.log(`   - Citas:             /api/citas`);
      console.log(`   - Historia Clínica:  /api/historias-clinicas`);
      console.log(`   - Inventario:        /api/inventario`);
      console.log(`   - Facturas:          /api/facturas`);
      console.log('');
      console.log('✅ Servidor listo para recibir peticiones');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err);
  process.exit(1);
});

// Iniciar servidor
startServer();
