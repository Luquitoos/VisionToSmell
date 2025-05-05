import axios from 'axios';

/* Definir a URL base para o backend */
const API_URL = 'http://localhost:5000/api';

/* Configurar configurações padrão do axios */
axios.defaults.baseURL = process.env.REACT_APP_API_URL || API_URL;

/* Interceptar solicitações para mostrar no console (conforme requisitos) */
axios.interceptors.request.use(request => {
  console.log('Solicitação de API:', {
    url: request.url,
    method: request.method,
    data: request.data,
    params: request.params
  });
  return request;
});

/* Interceptar respostas para mostrar no console (conforme requisitos) */
axios.interceptors.response.use(
  response => {
    console.log('Resposta da API:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const fetchConversions = async () => {
  try {
    const response = await axios.get('/conversions');
    return response.data.data?.conversions || []; /* Tratamento seguro para dados ausentes */
  } catch (error) {
    console.error('Erro ao buscar conversões:', error);
    throw error;
  }
};

export const getConversion = async (id) => {
  const response = await axios.get(`/conversions/${id}`);
  return response.data;
};

export const uploadVideo = async (formData) => {
  const response = await axios.post('/conversions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteConversion = async (id) => {
  const response = await axios.delete(`/conversions/${id}`);
  return response.data;
};

export const downloadAudio = (id) => {
  /* Usar a URL completa para o download, não window.open  */
  const downloadUrl = `${axios.defaults.baseURL}/conversions/${id}/download`;
  
  /* Criar um link temporário para download */
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = ''; /* O nome do arquivo será determinado pelo servidor */
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
