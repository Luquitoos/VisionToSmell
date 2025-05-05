import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import logger from './middleware/logger.js';
import { getDirname } from './utils/pathHelper.js';
import errorHandler from './utils/errorHandler.js';

const __dirname = getDirname(import.meta.url);

/* Caminho para o diretório de arquivos convertidos */
const convertedDir = path.join(__dirname, '../converted');

const app = express();

/* Configuração mais específica do CORS (Esse CORS é um manejo enre o Back e o Front) para permitir solicitações do frontend */
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.68.132:3000'], /* Permitir o frontend explicitamente */
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Logger de requisições personalizado */
app.use(logger);

/* Logger de requisições HTTP */
app.use(morgan('dev'));

/* Entregar arquivos do diretório 'converted' */
app.use('/audio', express.static(convertedDir));
app.use('/converted', express.static(convertedDir)); // Adiciona rota alternativa para compatibilidade

/* Rotas da API */
app.use('/api', apiRoutes);

/* Manipulador de rota principal (Aqui é Back) */
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Conversor de vídeo para áudio, mas aqui voce esta olhando somente o backend, vá para a porta 3000',
    endpoints: {
      api: '/api',
      audio: '/audio'
    }
  });
});

/* Middleware para rotas não encontradas */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint não encontrado' });
});

/* Middleware de tratamento de erros */
app.use((err, req, res, next) => {
  errorHandler.logError('Server error', err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    message: err.message || 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err.details || undefined
    } : undefined
  });
});

export default app;
