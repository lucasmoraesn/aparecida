import express from 'express';

const app = express();
const PORT = 3002;

app.get('/test', (req, res) => {
  res.json({ message: 'Server funcionando!' });
});

app.listen(PORT, () => {
  console.log(`✅ Test server rodando em http://localhost:${PORT}`);
});
