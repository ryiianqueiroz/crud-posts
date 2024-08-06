import express from 'express';
import cors from 'cors';
import { initializeData, deleteDataFile } from './api/initialize.js';
import commentsRouter from './api/comments.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-unused-vars
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Configuração do middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Middleware para gerenciar o arquivo data.json
app.use(async (req, res, next) => {
  console.log(`Middleware chamado para ${req.method} ${req.url}`);
  // eslint-disable-next-line no-undef
  const fileExists = await fs.access(dataFilePath).then(() => true).catch(() => false);
  console.log(`O arquivo data.json existe? ${fileExists}`);
  
  if (!fileExists) {
    try {
      console.log('Inicializando dados...');
      await initializeData();
    } catch (err) {
      console.error('Erro ao inicializar dados:', err);
      res.status(500).json({ message: 'Erro ao inicializar dados' });
      return;
    }
  }
  next();
});

// Rotas da API
app.use('/api', commentsRouter);

// Inicia o servidor
const startServer = async () => {
  try {
    await deleteDataFile();
    await initializeData();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
  }
};

startServer();