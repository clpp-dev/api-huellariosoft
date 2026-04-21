import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/config.js';
import { ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración de almacenamiento para fotos de mascotas
 */
const petPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/pets'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `pet-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Configuración de almacenamiento para archivos clínicos
 */
const clinicalFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/clinical-files'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `clinical-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

/**
 * Filtro para validar tipos de archivo de imágenes
 */
const imageFileFilter = (req, file, cb) => {
  if (config.uploads.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Tipo de archivo no permitido. Solo se permiten: ${config.uploads.allowedImageTypes.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Filtro para validar tipos de archivo clínicos
 */
const clinicalFileFilter = (req, file, cb) => {
  if (config.uploads.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Tipo de archivo no permitido. Solo se permiten: ${config.uploads.allowedFileTypes.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Middleware para subir fotos de mascotas
 */
export const uploadPetPhoto = multer({
  storage: petPhotoStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: config.uploads.maxFileSize,
  },
}).single('foto');

/**
 * Middleware para subir archivos clínicos
 */
export const uploadClinicalFile = multer({
  storage: clinicalFileStorage,
  fileFilter: clinicalFileFilter,
  limits: {
    fileSize: config.uploads.maxFileSize,
  },
}).array('archivos', 5); // Máximo 5 archivos

/**
 * Middleware para manejar errores de multer
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new ValidationError(
          `El archivo excede el tamaño máximo permitido de ${config.uploads.maxFileSize / 1024 / 1024}MB`
        )
      );
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ValidationError('Demasiados archivos'));
    }
    return next(new ValidationError(err.message));
  }
  next(err);
};
