import config from '../config/config.js';

/* Registra um erro */
export const logError = (location, error) => {
  console.error(`[ERRO] ${location}: ${error.message}`);
  if (config.env === 'development') {
    console.error(error.stack);
  }
};

/* Formata uma resposta de erro */
export const formatError = (error, defaultMessage = 'Ocorreu um erro') => {
  return {
    success: false,
    message: defaultMessage,
    error: config.env === 'development' ? error.message : undefined
  };
};

/* Exporta ambas as funções como propriedades do objeto de exportação padrão */
const errorHandler = {
  logError,
  formatError
};

export default errorHandler;
