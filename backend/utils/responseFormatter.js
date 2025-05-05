/*Utilitário para formatar respostas de API de maneira consistente*/

/*Formata a resposta para um padrão consistente em toda a API*/
export const formatResponse = (success, data = null, message = null) => {
  const response = { success };
  if (data) {
    response.data = data;
  }
  if (message) {
    response.message = message;
  }
  return response;
};

/* Exportação padrão para compatibilidade*/
const responseFormatter = {
  formatResponse
};

export default responseFormatter;