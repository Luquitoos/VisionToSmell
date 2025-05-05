import dotenv from 'dotenv';
import path from 'path';
import { getDirname } from '../utils/pathHelper.js';

const __dirname = getDirname(import.meta.url);

/*Rodar as variáveis de ambiente que ta no env*/ 
dotenv.config({ path: path.join(__dirname, '../../.env') });

/*Configurações para o Servidor*/
const config = {
  env: process.env.NODE_ENV, port: process.env.PORT || 5000,
  
  /*Configurações do MongoDB*/
  db: {
    uri: process.env.MONGODB_URI, options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  /*Configurações de arquivo, tive que limitar, pois meu cluster no MongoDB é o gratuito*/
  maxFileSize: 104857600, /*100MB em bytes*/
  allowedVideoFormats: ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'], /*Formatos de arquivo/vídeo aceitos*/
  outputAudioFormat: '.mp3', /*Vai ser convertido para mp3*/
  
  /*Quando você enviar um arquivo ele vai colocar esse arquivo em upload e quando converter ele vai criar o mp3 no convert, além do convertido que você baixou e deixou
  em alguma pasta do seu computador. Os arquivos convertidos são salvos localmente, mas o processamento e histórico de conversões são salvas no MongoDB, então se você perder 
  um arquivo convertido, vai poder fazer o download novamente graças ao MongoDB que salvou*/
  storage: {
    uploadDir: path.join(__dirname, '../../uploads'),
    convertedDir: path.join(__dirname, '../../converted')
  }
};

export default config;

