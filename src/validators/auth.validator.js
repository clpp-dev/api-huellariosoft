import { body, param } from 'express-validator';

/**
 * Validaciones para autenticación
 */
export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Validaciones para registro de usuario
 */
export const registerUserValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .notEmpty()
    .withMessage('El rol es requerido')
    .isIn(['administrador', 'veterinario', 'recepcionista', 'auxiliar'])
    .withMessage('Rol inválido'),
  body('telefono').optional().trim(),
];

/**
 * Validaciones para actualizar usuario
 */
export const updateUserValidation = [
  param('id').isMongoId().withMessage('ID de usuario inválido'),
  body('nombre')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres')
    .trim(),
  body('email').optional().isEmail().withMessage('El email debe ser válido').normalizeEmail(),
  body('rol')
    .optional()
    .isIn(['administrador', 'veterinario', 'recepcionista', 'auxiliar'])
    .withMessage('Rol inválido'),
  body('telefono').optional().trim(),
  body('activo').optional().isBoolean().withMessage('Activo debe ser booleano'),
];

/**
 * Validación de ID de MongoDB
 */
export const idValidation = [
  param('id').isMongoId().withMessage('ID inválido'),
];
