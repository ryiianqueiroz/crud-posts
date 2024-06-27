import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

const dataFilePath = path.join(__dirname, '../public', 'data.json'); // Caminho correto para data.json

// GET comments
app.get('/api/comments', (req, res) => {
  console.log('GET /api/comments called');
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ message: 'Error reading data' });
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      res.json(parsedData.comments);
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).json({ message: 'Error parsing data' });
    }
  });
});

// POST new comment
app.post('/api/comments', (req, res) => {
  console.log('POST /api/comments called with body:', req.body);
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ message: 'Error reading data' });
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      const comments = parsedData.comments;
      const newComment = req.body;
      newComment.id = comments.length + 1; // Atribuindo um ID ao novo comentário
      comments.push(newComment);

      fs.writeFile(dataFilePath, JSON.stringify(parsedData), (err) => {
        if (err) {
          console.error('Error writing data:', err);
          res.status(500).json({ message: 'Error writing data' });
          return;
        }
        res.status(201).json(newComment);
      });
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).json({ message: 'Error parsing data' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
