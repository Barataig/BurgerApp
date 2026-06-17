// ================================================
// CAMADA: Adapters — Routes
// ================================================

const express                      = require('express');
const { PaymentController }        = require('../controllers/PaymentController');
const { InMemoryPaymentRepository } = require('../../infra/repositories/InMemoryPaymentRepository');

const router     = express.Router();
const repository = new InMemoryPaymentRepository();
const controller = new PaymentController(repository);

// GET  /metodos              — lista métodos disponíveis
// POST /pagamentos           — processa pagamento
// GET  /pagamentos           — lista todos os pagamentos
// GET  /pagamentos/:pedidoId — busca pagamento por pedido

router.get('/metodos',                 (req, res) => controller.listarMetodos(req, res));
router.post('/pagamentos',             (req, res) => controller.processarPagamento(req, res));
router.get('/pagamentos',              (req, res) => controller.listarPagamentos(req, res));
router.get('/pagamentos/:pedidoId',    (req, res) => controller.buscarPorPedido(req, res));

module.exports = router;
