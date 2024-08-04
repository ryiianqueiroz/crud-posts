import { fs } from 'fs/promises';
import path from 'path';

// eslint-disable-next-line no-undef
const dataFilePath = path.join(__dirname, '..', '..', 'public', 'data.json');

export default async (req, res) => {
  const idComment = parseInt(req.query.id, 10);

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    const comments = parsedData.comments;
    const commentIndex = comments.findIndex(comment => comment.id === idComment);

    if (commentIndex === -1) {
      res.status(404).json({ message: 'Comentário não encontrado' });
      return;
    }

    if (req.method === 'DELETE') {
      if (req.headers['type'] === 'reply') {
        const replyID = parseInt(req.headers['id-reply'], 10);
        const replyIndex = comments[commentIndex].replies.findIndex(reply => reply.id === replyID);

        if (replyIndex === -1) {
          res.status(404).json({ message: 'Resposta não encontrada' });
          return;
        }

        comments[commentIndex].replies.splice(replyIndex, 1);
      } else {
        comments.splice(commentIndex, 1);
      }

      await fs.writeFile(dataFilePath, JSON.stringify(parsedData));
      res.status(200).json({ message: 'Comentário removido com sucesso!' });
    } else if (req.method === 'POST') {
      const newReply = req.body;
      newReply.id = comments[commentIndex].replies.length + 3;
      comments[commentIndex].replies.push(newReply);

      await fs.writeFile(dataFilePath, JSON.stringify(parsedData));
      res.status(201).json(newReply);
    } else if (req.method === 'PUT') {
      const newContent = req.headers['content'];
      const newScore = req.headers['gain'];

      if (req.headers['id-reply']) {
        const replyID = parseInt(req.headers['id-reply'], 10);
        const replyIndex = comments[commentIndex].replies.findIndex(reply => reply.id === replyID);

        if (replyIndex === -1) {
          res.status(404).json({ message: 'Resposta não encontrada' });
          return;
        }

        const reply = comments[commentIndex].replies[replyIndex];

        if (newContent) {
          reply.content = newContent;
        }

        if (newScore) {
          reply.score = newScore;
        }

        await fs.writeFile(dataFilePath, JSON.stringify(parsedData));
        res.status(201).json(reply);
      } else {
        const comment = comments[commentIndex];

        if (newContent) {
          comment.content = newContent;
        }

        if (newScore) {
          comment.score = newScore;
        }

        await fs.writeFile(dataFilePath, JSON.stringify(parsedData));
        res.status(201).json(comment);
      }
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
};
