import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Configuração do middleware
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Caminhos dos arquivos
const dataFilePathFirst = path.join(__dirname, '../public', 'data-copy.json');
const dataFilePath = path.join(__dirname, '../public', 'data.json');

// Inicializa os dados no arquivo data.json
const initializeData = async () => {
  try {
    await fs.copyFile(dataFilePathFirst, dataFilePath);
    console.log('Arquivo inicial copiado com sucesso');
  } catch (err) {
    console.error('Erro ao copiar arquivo inicial:', err);
  }
};

// Deleta o arquivo data.json
const deleteDataFile = async () => {
  try {
    await fs.rm(dataFilePath, { force: true });
    console.log('Arquivo deletado com sucesso');
  } catch (err) {
    console.error('Erro ao deletar arquivo:', err);
  }
};

// Middleware para gerenciar o arquivo data.json
app.use(async (req, res, next) => {
  console.log(`Middleware chamado para ${req.method} ${req.url}`);
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

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware para tratamento de erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Rota GET para obter os comentários
app.get('/api/comments', async (req, res) => {
  console.log('GET /api/comments chamado');
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    res.json(parsedData.comments);
    console.log('Resposta enviada com sucesso');
  } catch (err) {
    console.error('Erro ao ler data:', err);
    res.status(500).json({ message: 'Erro ao ler data' });
  }
});

// Rota POST para adicionar um novo comentário
app.post('/api/comments', async (req, res) => {
  console.log('POST /api/comments chamado:', req.body);
  
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const newComment = req.body;
    newComment.id = parsedData.comments.length + 1;
    parsedData.comments.push(newComment);
    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(201).json(newComment);
    console.log('Novo comentário adicionado com sucesso');
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

// Rota POST para adicionar uma resposta a um comentário
app.post('/api/comments/:id', async (req, res) => {
  console.log(`POST /api/comments/${req.params.id} chamado:`, req.body);
  const idComment = parseInt(req.params.id, 10);

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    const replies = comments[commentIndex].replies || [];
    const newReply = req.body;
    newReply.id = replies.length + 1; // Atribuindo um ID ao novo comentário
    replies.push(newReply);
    comments[commentIndex].replies = replies;

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(201).json(newReply);
    console.log('Resposta adicionada com sucesso');
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

// Rota DELETE para remover um comentário ou uma resposta
app.delete('/api/comments/:id', async (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  console.log(`DELETE /api/comments/${idComment} chamado`);

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (req.headers.type === 'reply') {
      console.log('Deletando uma resposta');
      const replies = comments[commentIndex].replies || [];
      const replyID = parseInt(req.headers['id-reply'], 10);
      const replyIndex = replies.findIndex(reply => reply.id === replyID);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }

      replies.splice(replyIndex, 1);
      comments[commentIndex].replies = replies;
    } else {
      console.log('Deletando um comentário');
      comments.splice(commentIndex, 1);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({ message: 'Comentário removido com sucesso!' });
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

// Rota PUT para atualizar um comentário ou resposta
app.put('/api/comments/:id', async (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  const content = req.headers['content'];
  const gain = req.headers['gain'];
  const idReply = parseInt(req.headers['id-reply'], 10);

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (idReply === -1) {
      // Atualizar conteúdo ou escore do comentário
      const comment = comments[commentIndex];
      if (content) comment.content = content;
      if (gain) comment.score = gain;
    } else {
      // Atualizar conteúdo ou escore de uma resposta
      const replies = comments[commentIndex].replies || [];
      const replyIndex = replies.findIndex(reply => reply.id === idReply);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }

      const reply = replies[replyIndex];
      if (content) reply.content = content;
      if (gain) reply.score = gain;
    }

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({ message: 'Atualização realizada com sucesso' });
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

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
