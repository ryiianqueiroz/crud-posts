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
  console.log('GET /api/comments chamado');
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

app.delete("/api/comments/:id", (req, res) => {
  const idComment = parseInt(req.params.id, 10)
  console.log(`api/comments/:${idComment} chamado`)

  fs.readFile(dataFilePath, "utf8", (err, data) => {
    if ( err ) {
      console.log("Erro ao ler o JSON", err)
      res.status(500).json({ message: "Error lendo dados"})
      return;
    }

    try {
      const dadosJSON = JSON.parse(data)
      const comments = dadosJSON.comments
      const commentIndex = comments.findIndex( comment => comment.id === idComment )
      

      if (commentIndex === -1) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      if ( req.headers["type"] === "reply" ) { // PARA CASO SEJA UM REPLY
        console.log("Deletando um reply")
        console.log(req.headers["id-reply"])
        
        const replies = comments[commentIndex].replies
        const replyID = req.headers["id-reply"]
        
        const indexReply = replies.findIndex( reply => reply.id === replyID )

        replies.splice(indexReply, 1)

        fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
          if ( err ) {
            console.log("Erro ao ler os dados:", err)
            res.status(500).json({ message: "Error lendo dados"})
            return;
          }
  
          res.status(200).json({ message: "Comentário removido com sucesso!"})
  
        })

      } else { // PARA CASO SEJA UM COMMENT
        
        console.log("Deletando um comment")
        comments.splice(commentIndex, 1)

        fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
          if ( err ) {
            console.log("Erro ao ler os dados:", err)
            res.status(500).json({ message: "Error lendo dados"})
            return;
          }
  
          res.status(200).json({ message: "Comentário removido com sucesso!"})
  
        })
      }

    } catch ( erro ) {
      console.error('Erro ao converter:', erro);
      res.status(500).json({ message: 'Erro ao converter dados' });
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
