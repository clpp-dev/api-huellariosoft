import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/validation.js';
import { loginValidation, changePasswordValidation } from '../validators/auth.validator.js';

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

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperación de contraseña
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Restablecer contraseña con token
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Cambiar contraseña del usuario autenticado
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);

export default router;
