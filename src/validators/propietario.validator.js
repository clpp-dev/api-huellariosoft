import { body, param, query } from 'express-validator';

/**
 * Validaciones para crear propietario
 */
export const createPropietarioValidation = [
  body('nombreCompleto')
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede exceder 150 caracteres')
    .trim(),
  body('documento')
    .notEmpty()
    .withMessage('El documento es requerido')
    .isLength({ max: 20 })
    .withMessage('El documento no puede exceder 20 caracteres')
    .trim(),
  body('telefono')
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres')
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
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('direccion')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres')
    .trim(),
];

/**
 * Validaciones para actualizar propietario
 */
export const updatePropietarioValidation = [
  param('id').isMongoId().withMessage('ID de propietario inválido'),
  body('nombreCompleto')
    .optional()
    .isLength({ max: 150 })
    .withMessage('El nombre no puede exceder 150 caracteres')
    .trim(),
  body('documento')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El documento no puede exceder 20 caracteres')
    .trim(),
  body('telefono')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  body('direccion')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede exceder 200 caracteres')
    .trim(),
];

/**
 * Validación de búsqueda
 */
export const searchValidation = [
  query('q')
    .optional()
    .isLength({ min: 1 })
    .withMessage('La búsqueda debe tener al menos 1 carácter')
    .trim(),
];

/**
 * Validación de ID
 */
export const idValidation = [
  param('id').isMongoId().withMessage('ID inválido'),
];
