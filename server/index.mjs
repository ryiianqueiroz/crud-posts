import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000; // Railway define automaticamente a porta

// Configuração do middleware
app.use(cors());
app.use(express.json());

const dataFilePathFirst = path.join(__dirname, 'data-copy.json');
const dataFilePath = path.join(__dirname, 'data.json');

const initializeData = async () => {
  try {
    await fs.copyFile(dataFilePathFirst, dataFilePath);
    console.log('Arquivo inicial copiado com sucesso');
  } catch (err) {
    console.error('Erro ao copiar arquivo inicial:', err);
  }
};

const deleteDataFile = async () => {
  try {
    await fs.unlink(dataFilePath);  // Tenta deletar o arquivo
    console.info(`Successfully removed file with the path of ${dataFilePath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.info("File doesn't exist, no need to delete.");
    } else if (err.code === 'EPERM') {
      console.error("Permission denied. Cannot delete the file.", err);
    } else {
      console.error("Something went wrong during deletion. Please try again later.", err);
    }
  }
};

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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

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


app.post('/api/comments', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const newComment = req.body;
    newComment.id = parsedData.comments.length + 1;
    parsedData.comments.push(newComment);
    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

app.post('/api/comments/:id', async (req, res) => {
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
    newReply.idReply = randomUUID();
    replies.push(newReply);
    comments[commentIndex].replies = replies;

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(201).json(newReply);
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (req.headers.type === 'reply') {
      const replies = comments[commentIndex].replies || [];
      const replyID = req.headers['id-reply'];
      const replyIndex = replies.findIndex(reply => reply.idReply === replyID);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }

      replies.splice(replyIndex, 1);
      comments[commentIndex].replies = replies;
    } else {
      comments.splice(commentIndex, 1);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({ message: 'Comentário removido com sucesso!' });
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

app.put('/api/comments/:id', async (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  const conteudo = req.headers['content'];
  const gain = parseInt(req.headers['gain']);
  const idReplyy = req.headers['id-reply'];

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (idReplyy === "-1") {
      const comment = comments[commentIndex];
      if (conteudo) comment.content = conteudo;
      if (gain) comment.score = gain;
    } else {
      const replies = comments[commentIndex].replies || [];
      const replyIndex = replies.findIndex(reply => reply.idReply === idReplyy);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }

      const reply = replies[replyIndex];
      if (conteudo) reply.content = conteudo;
      if (gain) reply.score = gain;
    }

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({ message: 'Atualização realizada com sucesso' });
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});


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