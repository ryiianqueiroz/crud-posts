import express from 'express';
const app = express();
const port = 3001; // Porta alterada

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});