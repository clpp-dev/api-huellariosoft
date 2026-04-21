/**
 * Wrapper para funciones async en Express
 * Captura errores automáticamente y los pasa al middleware de manejo de errores
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
