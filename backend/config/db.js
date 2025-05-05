import mongoose from 'mongoose';
import config from './config.js';

/*Função de conexão com o MongoDB*/
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
    console.log(`MongoDB conectado com sucesso: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Falha na conexão com o MongoDB: ${error.message}`); /*se não conectar com o mongo, eu ja deixei configurado, se der errado é porque voce mexeu no URI do env*/
    process.exit(1);
  }
};

export default connectDB;
