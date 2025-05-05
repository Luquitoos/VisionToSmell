// Load environment variables first, before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import app from './app.js';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!fs.existsSync(config.storage.uploadDir)) {
  fs.mkdirSync(config.storage.uploadDir, { recursive: true });
  console.log(`Diretório de upload criado: ${config.storage.uploadDir}`);
}

if (!fs.existsSync(config.storage.convertedDir)) {
  fs.mkdirSync(config.storage.convertedDir, { recursive: true });
  console.log(`Diretório de arquivos convertidos criado: ${config.storage.convertedDir}`);
}


async function connectMongoDB() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(config.db.uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    return false;
  }
}


const PORT = config.port;

connectMongoDB().then(connected => {
  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${config.env}`);
    console.log(`Status do MongoDB: ${connected ? 'Conectado' : 'Não conectado'}`);
    console.log(`Acessa: http://localhost:${PORT}/`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log('Rejeição não tratada, Desligando...');
    console.error(err);
    server.close(() => {
      process.exit(1);
    });
  });
});
