import Conversion from '../models/Conversion.js';
import conversionService from '../services/conversionService.js';
import errorHandler from '../utils/errorHandler.js';
import fileHelper from '../utils/fileHelper.js';
import { formatResponse } from '../utils/responseFormatter.js';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

/* Validar MongoDB ObjectId */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/* Obter todas as conversões no GET /api/conversions */
const getAllConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find().select('-__v').sort({ createdAt: -1 });  /*(-__v) serve pra ele não pegar a chave dos convertidos na seleção*/
    res.status(200).json(formatResponse(true, {count: conversions.length, conversions}));
  } catch (error) {
    errorHandler.logError('conversionController.getAllConversions', error);
    res.status(500).json(errorHandler.formatError(error, 'Não foi possível recuperar as conversões'));
  }
};

/*Obter uma única conversão por ID no GET /api/conversions/:id */
const getConversionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    /* Verificar se o ID é um ObjectId válido do MongoDB */
    if (!isValidObjectId(id)) {
      return res.status(400).json(formatResponse(false, null, 'ID de conversão inválido'));
    }

    const conversion = await Conversion.findById(id).select('-__v');
    
    if (!conversion) {
      return res.status(404).json(formatResponse(false, null, 'Conversão não encontrada'));
    }
    res.status(200).json(formatResponse(true, conversion));
  } catch (error) {
    errorHandler.logError('conversionController.getConversionById', error);
    res.status(500).json(errorHandler.formatError(error, 'Não foi possível recuperar a conversão'));
  }
};

/* Criar uma nova conversão POST /api/conversions */
const createConversion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(formatResponse(false, null, 'Por favor, envie um arquivo de vídeo'));
    }

    const maxSize = 100 * 1024 * 1024; /* 100MB */
    
    if (req.file.size > maxSize) {
      fileHelper.deleteFile(req.file.path);
      return res.status(400).json(formatResponse(false, null, 'O tamanho do arquivo excede o limite máximo de 100 MB'));
    }
    
    const conversion = await conversionService.convertVideoToAudio(req.file.path, req.file.originalname, req.file.size);
    
    res.status(201).json(formatResponse(true, conversion, 'A conversão foi iniciada com sucesso'));
    
  } catch (error) {
    if (req.file) {
      fileHelper.deleteFile(req.file.path);
    }
    errorHandler.logError('conversionController.createConversion', error);
    res.status(500).json(errorHandler.formatError(error, 'Falha na conversão'));
  }
};

/* Baixar um arquivo de áudio convertido no GET /api/conversions/:id/download */
const downloadConversion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json(formatResponse(false, null, 'ID de conversão inválido'));
    }

    const conversion = await Conversion.findById(id);
    
    if (!conversion) {
      return res.status(404).json(formatResponse(false, null, 'Conversão não encontrada'));
    }

    /* Verificar se a conversão está completa - aceitar tanto 'completed' quanto 'concluído' */
    if (conversion.status !== 'completed' && conversion.status !== 'concluído') {
      return res.status(400).json(formatResponse(false, null, `A conversão não está pronta para download (status atual: ${conversion.status})`));  /* Uso de ` no lugar de ' pra conseguir pegar o conversion.status sem usar format */
    }
    
    /* Verificar se o arquivo de áudio existe */
    if (!fs.existsSync(conversion.audioPath)) {
      return res.status(404).json(formatResponse(false, null, 'Arquivo de áudio não encontrado'));
    }

    /* Definir os titulos para download de arquivo com os tratamentos para não dar erro na hora de criar e não conseguir porque o titulo teria um caracter especial */
    res.setHeader('Content-Disposition', `attachment; filename="${conversion.originalName.replace(/\.[^/.]+$/, '')}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    
    /* Enviar o arquivo */
    const fileStream = fs.createReadStream(conversion.audioPath);
    fileStream.pipe(res);
  } catch (error) {
    errorHandler.logError('conversionController.downloadConversion', error);
    res.status(500).json(errorHandler.formatError(error, 'Não foi possível baixar a conversão'));
  }
};

/* Excluir uma conversão DELETE /api/conversions/:id */
const deleteConversion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json(formatResponse(false, null, 'ID de conversão inválido'));
    }

    const conversion = await Conversion.findById(id);
    
    if (!conversion) {
      return res.status(404).json(formatResponse(false, null, 'Conversão não encontrada'));
    }
    
    /* Tentar excluir arquivos, mas não falhar se os arquivos já não existirem */
    try {
      fileHelper.deleteFile(conversion.videoPath);
      fileHelper.deleteFile(conversion.audioPath);
    } catch (fileError) {
      errorHandler.logError('conversionController.deleteConversion.fileDelete', fileError);
      /* Continuar com a exclusão mesmo se os arquivos não puderem ser excluídos */
    }
    
    await Conversion.findByIdAndDelete(id);
    
    res.status(200).json(formatResponse(true, null, 'Conversão excluída com sucesso'));
  } catch (error) {
    errorHandler.logError('conversionController.deleteConversion', error);
    res.status(500).json(errorHandler.formatError(error, 'Não foi possível excluir a conversão'));
  }
};

/* pra exportas as funções nas importações, pois não estou usando communJS e sim ModuleJs, que é um prática melhor */
export { getAllConversions, getConversionById, createConversion, deleteConversion, downloadConversion };

/*exportação padrão de tudo com o nome de conversionControlller */
const conversionController = { getAllConversions, getConversionById, createConversion, deleteConversion, downloadConversion };

/*Apararentemente é uma boa prática fazer esse processo do que fazer simplesmente o export nesse caso, mesmo que pareça ser redundante*/

export default conversionController;
