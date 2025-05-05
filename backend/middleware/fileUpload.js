import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';
import errorHandler from '../utils/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Configuraração do armazenamento */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
    }
  }
);

/* Filtro de arquivo com erros detalhados */
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (!config.allowedVideoFormats.includes(fileExt)) {
    const error = new Error(`Tipo de arquivo inválido. Formatos suportados: ${config.allowedVideoFormats.join(', ')}`);
    error.code = 'INVALID_FILE_TYPE';
    
    return cb(error, false);
  }
  cb(null, true);
};

/* Middleware de tratamento de erros (Essas funções já existem prontas no padrão de tratamento de erro de arquivos, só pesquisar) */
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `O tamanho do arquivo excede o limite de ${config.maxFileSize / (1024 * 1024)}MB`
      });
    }
  }

  errorHandler.logError('fileUpload', error);
  res.status(400).json({
    success: false,
    message: error.message || 'Falha no upload do arquivo'
  });
};

/* Criar middleware de upload */
export const upload = multer({storage, fileFilter, limits: { fileSize: config.maxFileSize }}); /* Padrão: 100MB */
