import { body, param, query } from 'express-validator';

/**
 * Validaciones para crear cita
 */
export const createCitaValidation = [
  body('mascota')
    .notEmpty()
    .withMessage('La mascota es requerida')
    .isMongoId()
    .withMessage('ID de mascota inválido'),
  body('propietario')
    .notEmpty()
    .withMessage('El propietario es requerido')
    .isMongoId()
    .withMessage('ID de propietario inválido'),
  body('veterinario')
    .notEmpty()
    .withMessage('El veterinario es requerido')
    .isMongoId()
    .withMessage('ID de veterinario inválido'),
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .isISO8601()
    .withMessage('Formato de fecha inválido'),
  body('hora')
    .notEmpty()
    .withMessage('La hora es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Formato de hora inválido (HH:MM)'),
  body('motivo')
    .notEmpty()
    .withMessage('El motivo es requerido')
    .isLength({ max: 300 })
    .withMessage('El motivo no puede exceder 300 caracteres')
    .trim(),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),
];

/**
 * Validaciones para actualizar cita
 */
export const updateCitaValidation = [
  param('id').isMongoId().withMessage('ID de cita inválido'),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('Formato de fecha inválido'),
  body('hora')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Formato de hora inválido (HH:MM)'),
  body('motivo')
    .optional()
    .isLength({ max: 300 })
    .withMessage('El motivo no puede exceder 300 caracteres')
    .trim(),
  body('estado')
    .optional()
    .isIn(['programada', 'completada', 'cancelada'])
    .withMessage('Estado inválido'),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),
];

/**
 * Validaciones para filtros de citas
 */
export const citaFiltersValidation = [
  query('fecha').optional().isISO8601().withMessage('Formato de fecha inválido'),
  query('veterinario').optional().isMongoId().withMessage('ID de veterinario inválido'),
  query('estado')
    .optional()
    .isIn(['programada', 'completada', 'cancelada'])
    .withMessage('Estado inválido'),
];

/**
 * Validación de ID
 */
export const idValidation = [
  param('id').isMongoId().withMessage('ID inválido'),
];
