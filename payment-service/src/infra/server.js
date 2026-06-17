// ================================================
// CAMADA: Infra — Server
// ================================================

const express       = require('express');
const cors          = require('cors');
const paymentRoutes = require('../adapters/routes/paymentRoutes');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ servico: 'payment-service', status: 'online', porta: PORT });
});

app.use('/api', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`✅ payment-service rodando na porta ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/pagamentos`);
});

module.exports = app;
