// ================================================
// CAMADA: Adapters — Routes
// SOLID (SRP): apenas define as rotas HTTP
// ================================================

const express                = require('express');
const { OrderController }    = require('../controllers/OrderController');
const { InMemoryOrderRepository } = require('../../infra/repositories/InMemoryOrderRepository');

const router     = express.Router();
const repository = new InMemoryOrderRepository();
const controller = new OrderController(repository);

// GET  /cardapio          — lista burgers e adicionais disponíveis
// POST /pedidos           — cria novo pedido
// GET  /pedidos           — lista todos os pedidos
// GET  /pedidos/:id       — busca pedido por id
// PUT  /pedidos/:id/status — atualiza status do pedido

router.get('/cardapio', (req, res)       => controller.listarCardapio(req, res));
router.post('/pedidos', (req, res)       => controller.criarPedido(req, res));
router.get('/pedidos', (req, res)        => controller.listarPedidos(req, res));
router.get('/pedidos/:id', (req, res)    => controller.buscarPedido(req, res));
router.put('/pedidos/:id/status', (req, res) => controller.atualizarStatus(req, res));

module.exports = router;
