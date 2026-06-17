// ================================================
// CAMADA: Infra — Server
// Ponto de entrada da aplicação
// ================================================

const express    = require('express');
const cors       = require('cors');
const orderRoutes = require('../adapters/routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ servico: 'order-service', status: 'online', porta: PORT });
});

// Rotas do domínio
app.use('/api', orderRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`✅ order-service rodando na porta ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/pedidos`);
});

module.exports = app;
