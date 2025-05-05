import mongoose from 'mongoose';

/*O mongoose (MongoDB) tem um tipo de estrutura chamado Schema, só pesquisar, e to usando para validações */

const ConversionSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  videoPath: {
    type: String,
    required: true
  },
  audioPath: {
    type: String,
    required: true
  },
  audioFilename: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'processando', 'concluído', 'falha'],
    default: 'pendente'
  },
  fileSize: {
    type: Number,
    required: true
  },
  duration: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Conversion = mongoose.model('Conversion', ConversionSchema);

export default Conversion;
