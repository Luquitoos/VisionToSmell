import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Conversion from '../models/Conversion.js';
import config from '../config/config.js';
import errorHandler from '../utils/errorHandler.js';
import { formatResponse } from '../utils/responseFormatter.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*A MAIORIA DESSAS FUNÇÕES SÃO REQUISIÇÕES DO FFMEG PARA PODER CONVERTER, AFINAL NÃO IRIA FAZER TODO UM ALGORITMO PARA TRANSFORMAR UM VIDEO EM UM AUDIO ATÉ O DIA 11*/

/* Converte um arquivo de vídeo para áudio*/
export const convertVideoToAudio = async (videoPath, originalName, fileSize) => {
  try {
    if (!videoPath || !originalName || !fileSize) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }

    if (!fs.existsSync(videoPath)) {
      throw new Error('Arquivo de vídeo não encontrado');
    }

    const audioFilename = `${uuidv4()}${config.outputAudioFormat}`;
    const audioPath = path.join(__dirname, '../../converted', audioFilename);

    const conversion = await Conversion.create({ originalName, videoPath, audioPath, audioFilename, status: 'processando', fileSize});

    processConversion(conversion._id, videoPath, audioPath).catch(error => {
      errorHandler.logError('convertVideoToAudio.processConversion', error);
    });

    return formatResponse(true, conversion);
  } catch (error) {
    errorHandler.logError('convertVideoToAudio', error);
    throw error;
  }
};

/* Criar exportação padrão para função de videoToAudio */
const conversionService = {convertVideoToAudio};

export default conversionService;

const processConversion = async (conversionId, videoPath, audioPath) => {
  try {
    const outputDir = path.dirname(audioPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, async (err, metadata) => {
        if (err) {
          errorHandler.logError('conversionService.processConversion.ffprobe', err);
          await updateConversionStatus(conversionId, 'falha', 'Falha ao analisar arquivo de vídeo');
          return reject(err);
        }

        try {
          const duration = metadata.format.duration;
          await Conversion.findByIdAndUpdate(conversionId, { duration });
          resolve();
        } catch (updateError) {
          errorHandler.logError('conversionService.processConversion.updateDuration', updateError);
          reject(updateError);
        }
      });
    });

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .on('progress', async (progress) => {
          try {
            if (progress.percent) {
              await Conversion.findByIdAndUpdate(conversionId, { 
                progress: Math.round(progress.percent) 
              });
            }
          } catch (progressError) {
            errorHandler.logError('conversionService.processConversion.progress', progressError);
          }
        })
        .on('end', async () => {
          console.log('Conversão concluída com sucesso');
          await updateConversionStatus(conversionId, 'concluído', 'Conversão bem-sucedida');
          resolve();
        })
        .on('error', async (err) => {
          errorHandler.logError('conversionService.processConversion.ffmpeg', err);
          await updateConversionStatus(conversionId, 'falha', 'Processo de conversão falhou');
          reject(err);
        })
        .run();
    });
  } catch (error) {
    errorHandler.logError('conversionService.processConversion', error);
    await updateConversionStatus(conversionId, 'falha', error.message || 'Erro desconhecido durante a conversão');
  }
};

const updateConversionStatus = async (conversionId, status, message = null) => {
  try {
    const updateData = { 
      status,
      updatedAt: new Date()
    };

    if (message) {
      updateData.statusMessage = message;
    }

    await Conversion.findByIdAndUpdate(conversionId, updateData);
  } catch (error) {
    errorHandler.logError('conversionService.updateConversionStatus', error);
  }
};
