import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../public/data.json');
const rawData = readFileSync(dataPath);
const data = JSON.parse(rawData);

const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos do diretório 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para obter todos os comentários
app.get('/api/comments', (req, res) => {
  res.json(data.comments);
});

// Adicionar mais endpoints para operações CRUD conforme necessário

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
