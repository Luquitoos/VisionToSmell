/* Middleware de logger personalizado para registrar todas as requisições recebidas */
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);

  /* Registrar a estrutura da requisição para solicitações POST */
  if (req.method === 'POST' && req.body) {
    console.log('Estrutura da requisição:', JSON.stringify(req.body));
  }

  /* Registrar parâmetros de consulta */
  if (Object.keys(req.query).length > 0) {
    console.log('Parâmetros de consulta:', JSON.stringify(req.query));
  }

  /* Criar uma cópia da função original de envio */
  const originalSend = res.send;

  /* Substituir a função de envio para registrar a resposta */
  res.send = function (body) {
    /* Registrar resposta (partir se for muito grande) */
    let responseBody = body;
    
    if (typeof body === 'string' && body.length > 500) {
      responseBody = body.substring(0, 500) + '... [truncado]';
    }

    console.log(`${new Date().toISOString()} | Resposta: ${res.statusCode}`);

    /* Chamar a função de envio original */
    return originalSend.call(this, body);
  };

  next();
};

export default logger;
