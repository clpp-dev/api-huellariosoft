import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import propietarioRoutes from './propietario.routes.js';
import mascotaRoutes from './mascota.routes.js';
import citaRoutes from './cita.routes.js';
import historiaClinicaRoutes from './historiaClinica.routes.js';
import inventarioRoutes from './inventario.routes.js';
import facturaRoutes from './factura.routes.js';

const router = Router();

/**
 * Ruta de bienvenida a la API
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a HuellarioSoft API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      propietarios: '/api/propietarios',
      mascotas: '/api/mascotas',
      citas: '/api/citas',
      historias_clinicas: '/api/historias-clinicas',
      inventario: '/api/inventario',
      facturas: '/api/facturas',
    },
  });
});

/**
 * Rutas de la aplicación
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/propietarios', propietarioRoutes);
router.use('/mascotas', mascotaRoutes);
router.use('/citas', citaRoutes);
router.use('/historias-clinicas', historiaClinicaRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/facturas', facturaRoutes);

export default router;
