import { body, param } from 'express-validator';

/**
 * Validaciones para crear mascota
 */
export const createMascotaValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres')
    .trim(),
  body('especie')
    .notEmpty()
    .withMessage('La especie es requerida')
    .isIn(['perro', 'gato', 'ave', 'roedor', 'reptil', 'otro'])
    .withMessage('Especie inválida'),
  body('raza')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La raza no puede exceder 100 caracteres')
    .trim(),
  body('sexo')
    .notEmpty()
    .withMessage('El sexo es requerido')
    .isIn(['macho', 'hembra'])
    .withMessage('Sexo inválido'),
  body('edad.valor')
    .optional()
    .isNumeric()
    .withMessage('La edad debe ser numérica')
    .custom((value) => value >= 0)
    .withMessage('La edad no puede ser negativa'),
  body('edad.unidad')
    .optional()
    .isIn(['meses', 'años'])
    .withMessage('Unidad de edad inválida'),
  body('peso')
    .optional()
    .isNumeric()
    .withMessage('El peso debe ser numérico')
    .custom((value) => value >= 0 && value <= 500)
    .withMessage('El peso debe estar entre 0 y 500 kg'),
  body('color')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El color no puede exceder 100 caracteres')
    .trim(),
  body('estadoReproductivo')
    .optional()
    .isIn(['entero', 'castrado', 'esterilizado'])
    .withMessage('Estado reproductivo inválido'),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),
  body('propietario')
    .notEmpty()
    .withMessage('El propietario es requerido')
    .isMongoId()
    .withMessage('ID de propietario inválido'),
];

/**
 * Validaciones para actualizar mascota
 */
export const updateMascotaValidation = [
  param('id').isMongoId().withMessage('ID de mascota inválido'),
  body('nombre')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres')
    .trim(),
  body('especie')
    .optional()
    .isIn(['perro', 'gato', 'ave', 'roedor', 'reptil', 'otro'])
    .withMessage('Especie inválida'),
  body('raza')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La raza no puede exceder 100 caracteres')
    .trim(),
  body('sexo')
    .optional()
    .isIn(['macho', 'hembra'])
    .withMessage('Sexo inválido'),
  body('edad.valor')
    .optional()
    .isNumeric()
    .withMessage('La edad debe ser numérica')
    .custom((value) => value >= 0)
    .withMessage('La edad no puede ser negativa'),
  body('edad.unidad')
    .optional()
    .isIn(['meses', 'años'])
    .withMessage('Unidad de edad inválida'),
  body('peso')
    .optional()
    .isNumeric()
    .withMessage('El peso debe ser numérico')
    .custom((value) => value >= 0 && value <= 500)
    .withMessage('El peso debe estar entre 0 y 500 kg'),
  body('color')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El color no puede exceder 100 caracteres')
    .trim(),
  body('estadoReproductivo')
    .optional()
    .isIn(['entero', 'castrado', 'esterilizado'])
    .withMessage('Estado reproductivo inválido'),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),
];

/**
 * Validación de ID
 */
export const idValidation = [
  param('id').isMongoId().withMessage('ID inválido'),
];
