import express from 'express';
import { param } from 'express-validator';
import conversionController from '../controllers/conversionController.js';
import { upload, handleUploadError } from '../middleware/fileUpload.js';

const router = express.Router();

/* Middleware de validação para parâmetro de ID */
const validateObjectId = param('id').isMongoId().withMessage('ID de conversão inválido');

/* Rotas de conversão */
router.route('/conversions').get(conversionController.getAllConversions).post(upload.single('video'), handleUploadError, conversionController.createConversion);

router.route('/conversions/:id').get(validateObjectId, conversionController.getConversionById).delete(validateObjectId, conversionController.deleteConversion);

router.get('/conversions/:id/download', validateObjectId, conversionController.downloadConversion);

/* é a rota GET /api/status e verifica o status da API */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'A API está rodando',
    timestamp: new Date().toISOString()
  });
});

export default router;
