const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'localizacoes.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// POST - Recebe localização e salva
app.post('/localizacao', (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });
  }

  const novaLoc = {
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  };

  let dados = [];
  if (fs.existsSync(DB_FILE)) {
    dados = JSON.parse(fs.readFileSync(DB_FILE));
  }

  dados.push(novaLoc);
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
  res.json({ status: 'Congratulations!! Gift Received' });
});

app.get('/localizacoes', (req, res) => {
  if (!fs.existsSync(DB_FILE)) return res.json([]);
  const dados = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(dados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
