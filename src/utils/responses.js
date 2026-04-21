/**
 * Utilidades para respuestas HTTP estandarizadas
 */

/**
 * Respuesta exitosa
 */
export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Respuesta de error
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta paginada
 */
export const paginatedResponse = (res, data, pagination, message = 'Datos obtenidos exitosamente') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};
