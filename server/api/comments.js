import express from 'express';
import fs from 'fs/promises';
// eslint-disable-next-line no-unused-vars
import path from 'path';
import { randomUUID } from 'crypto';
import { dataFilePath } from './initialize.js';

const router = express.Router();

// Rota GET para obter os comentários
router.get('/comments', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    res.json(parsedData.comments);
  } catch (err) {
    console.error('Erro ao ler data:', err);
    res.status(500).json({ message: 'Erro ao ler data' });
  }
});

// Rota POST para adicionar um novo comentário
router.post('/comments', async (req, res) => {
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

// Rota POST para adicionar uma resposta a um comentário
router.post('/comments/:id', async (req, res) => {
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

// Rota DELETE para remover um comentário ou uma resposta
router.delete('/comments/:id', async (req, res) => {
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

// Rota PUT para atualizar um comentário ou resposta
router.put('/comments/:id', async (req, res) => {
  const idComment = parseInt(req.params.id, 10);
  const conteudo = req.headers['content'];
  const gain = parseInt(req.headers['gain']);  
  const idReplyy = (req.headers['id-reply']);

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
      if (conteudo) { comment.content = conteudo }
      if (gain) { comment.score = gain }
    } else {
      const replies = comments[commentIndex].replies || [];
      const replyIndex = replies.findIndex(reply => reply.idReply === idReplyy);

      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }

      const reply = replies[replyIndex];
      if (conteudo) { reply.content = conteudo }
      if (gain) { reply.score = gain }
    }

    await fs.writeFile(dataFilePath, JSON.stringify(parsedData, null, 2));
    res.status(200).json({ message: 'Atualização realizada com sucesso' });
  } catch (err) {
    console.error('Erro ao processar solicitação:', err);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
});

export default router;
