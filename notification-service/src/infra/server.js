const express            = require('express');
const cors               = require('cors');
const notificationRoutes = require('../adapters/routes/notificationRoutes');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ servico: 'notification-service', status: 'online', porta: PORT });
});

app.use('/api', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`✅ notification-service rodando na porta ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/notificacoes`);
});

module.exports = app;
