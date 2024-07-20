import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

let dataFilePathFirst = path.join(__dirname, '../public', 'data-copy.json');
let dataFilePath = path.join(__dirname, '../public', 'data.json');

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

app.get('/api/comments', async (req, res) => {
  console.log('GET /api/comments chamado');
  try {
    console.log('Tentando ler o arquivo data.json...');
    const data = await fs.readFile(dataFilePath, 'utf8');
    console.log('Arquivo lido com sucesso');
    const parsedData = JSON.parse(data);
    console.log('Dados lidos:', parsedData);
    res.json(parsedData.comments);
    console.log('Resposta enviada com sucesso');
  } catch (err) {
    console.error('Erro ao ler data:', err);
    res.status(500).json({ message: 'Erro ao ler data' });
  }
});

// POST new comment
app.post('/api/comments', (req, res) => {  // POSTAR UM COMMENT
  console.log('POST /api/comments chamado:', req.body);
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler data:', err);
      res.status(500).json({ message: 'Erro ao ler data' });
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
          console.error('Erro ao escrever dados:', err);
          res.status(500).json({ message: 'Erro ao escrever dados' });
          return;
        }
        res.status(201).json(newComment);
      });
    } catch (parseErr) {
      console.error('Erro ao converter: ', parseErr);
      res.status(500).json({ message: 'Error parsing data' });
    }
  });
});

app.post('/api/comments/:id', (req, res) => {  // POSTAR UM REPLY
  console.log(`POST /api/comments/${req.params.id} chamado:`, req.body);
  const idComment = parseInt(req.params.id, 10)

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler data:', err);
      res.status(500).json({ message: 'Erro ao ler data' });
      return;
    }

    try {
      const dadosJSON = JSON.parse(data)
      const comments = dadosJSON.comments
      const commentIndex = comments.findIndex( comment => comment.id === idComment )

      const replies = comments[commentIndex]
      console.log(replies)

      const newComment = req.body;
      newComment.id = replies.replies.length + 3; // Atribuindo um ID ao novo comentário
      replies.replies.push(newComment);

      fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
        if (err) {
          console.error('Erro ao escrever dados:', err);
          res.status(500).json({ message: 'Erro ao escrever dados' });
          return;
        }
        res.status(201).json(newComment);
      });
    } catch (erroConverter) {
      console.error('Erro ao converter: ', erroConverter);
      res.status(500).json({ message: 'Erro ao converter dados' });
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

app.put("/api/comments/:id", (req, res) => { // METODO UPDATE
  if ( req.headers["content"] ) {  // SE FOR O FUNCTION PARA UPDATE CONTENT
    console.log(`UPDATE CONTENT /api/comments/${req.params.id} chamado:`, req.headers["content"]);
    const idComment = parseInt(req.params.id, 10)

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler data:', err);
        res.status(500).json({ message: 'Erro ao ler data' });
        return;
      }

      console.log(req.headers["id-reply"])

      try {
        if ( parseInt(req.headers["id-reply"]) === -1 ) {
          const dadosJSON = JSON.parse(data)
          const comments = dadosJSON.comments
          const commentIndex = comments.findIndex( comment => comment.id === idComment )

          const commentID = comments[commentIndex]
          console.log(commentID)

          const newContent = req.headers["content"];
          console.log(newContent)
          commentID.content = newContent;

          fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
            if (err) {
              console.error('Erro ao escrever dados:', err);
              res.status(500).json({ message: 'Erro ao escrever dados' });
              return;
            }
            res.status(201).json(commentID);
          });
        } else {
          const dadosJSON = JSON.parse(data)
          const comments = dadosJSON.comments
          const commentIndex = comments.findIndex( comment => comment.id === idComment )

          const replies = comments[commentIndex].replies
          const replyID = parseInt(req.headers["id-reply"])
          
          const indexReply = replies.findIndex( (reply) => {
            if ( parseInt(reply.id) === replyID ) {
              return parseInt(reply.id)
            }
          } )                

          console.log(`IndexReply =`, indexReply)
          const reply = replies[indexReply]

          const newContent = req.headers["content"];
          reply.content = newContent;

          fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
            if (err) {
              console.error('Erro ao escrever dados:', err);
              res.status(500).json({ message: 'Erro ao escrever dados' });
              return;
            }
            res.status(201).json(reply);
          });
        }
      } catch (erroConverter) {
        console.error('Erro ao converter: ', erroConverter);
        res.status(500).json({ message: 'Erro ao converter dados' });
      }
    });
  } else {  //////////// METODO SCORE ///////////
    console.log(`UPDATE SCORE /api/comments/${req.params.id} chamado:`, req.headers["gain"]);
    const idComment = parseInt(req.params.id, 10)

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler data:', err);
        res.status(500).json({ message: 'Erro ao ler data' });
        return;
      }

      try {
        if ( parseInt(req.headers["id-reply"]) === -1 ) {
          console.log("COMMENTÁRIO")
          const dadosJSON = JSON.parse(data)
          const comments = dadosJSON.comments
          const commentIndex = comments.findIndex( comment => comment.id === idComment )

          const commentID = comments[commentIndex]
          console.log("ID do Comment = ", commentID)

          const newScore = req.headers["gain"];
          console.log("Novo Score = ", newScore)
          commentID.score = newScore;

          fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
            if (err) {
              console.error('Erro ao escrever dados:', err);
              res.status(500).json({ message: 'Erro ao escrever dados' });
              return;
            }
            res.status(201).json(commentID);
          });
        } else {
          console.log("RESPOSTA")
          const dadosJSON = JSON.parse(data)
          const comments = dadosJSON.comments
          const commentIndex = comments.findIndex( comment => comment.id === idComment )

          const replies = comments[commentIndex].replies
          const replyID = parseInt(req.headers["id-reply"])
          
          const indexReply = replies.findIndex( (reply) => {
            if ( parseInt(reply.id) === replyID ) {
              return parseInt(reply.id)
            }
          } )                

          console.log(`IndexReply =`, indexReply)
          const reply = replies[indexReply]

          const newScore = req.headers["gain"];
          reply.score = newScore;

          fs.writeFile(dataFilePath, JSON.stringify(dadosJSON), (err) => {
            if (err) {
              console.error('Erro ao escrever dados:', err);
              res.status(500).json({ message: 'Erro ao escrever dados' });
              return;
            }
            res.status(201).json(reply);
          });
        }
      } catch (erroConverter) {
        console.error('Erro ao converter: ', erroConverter);
        res.status(500).json({ message: 'Erro ao converter dados' });
      }
    });
  }
})

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