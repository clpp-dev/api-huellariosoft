import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import { loginValidation } from '../validators/auth.validator.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', loginValidation, handleValidationErrors, authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar token de acceso
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (en el cliente se elimina el token)
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

export default router;
