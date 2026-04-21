import { User } from './src/models/User.js';
import { connectDB } from './src/config/database.js';

/**
 * Script para crear un usuario administrador inicial
 * Ejecutar con: node createAdmin.js
 */

const createAdminUser = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ rol: 'administrador' });

    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario administrador');
      console.log('📧 Email:', existingAdmin.email);
      process.exit(0);
    }

    // Crear usuario administrador
    const adminData = {
      nombre: 'Administrador',
      email: 'admin@huellariosoft.com',
      password: '123456Usuario',
      rol: 'administrador',
      telefono: '3001234567',
      activo: true,
    };

    const admin = await User.create(adminData);

    console.log('');
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: 123456Usuario');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    process.exit(1);
  }
};

createAdminUser();
