import { fs } from 'fs/promises';
import path from 'path';

// eslint-disable-next-line no-undef
const dataFilePath = path.join(__dirname, '..', 'public', 'data.json');

export default async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);

    if (req.method === 'GET') {
      res.status(200).json(parsedData.comments);
    } else if (req.method === 'POST') {
      const newComment = req.body;
      newComment.id = parsedData.comments.length + 1;
      parsedData.comments.push(newComment);

      await fs.writeFile(dataFilePath, JSON.stringify(parsedData));
      res.status(201).json(newComment);
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
};
