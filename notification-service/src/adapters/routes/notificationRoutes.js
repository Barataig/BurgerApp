// ── Routes ──────────────────────────────────────
const express                          = require('express');
const { NotificationController }       = require('../controllers/NotificationController');
const { InMemoryNotificationRepository } = require('../../infra/repositories/InMemoryNotificationRepository');

const router     = express.Router();
const repository = new InMemoryNotificationRepository();
const controller = new NotificationController(repository);

router.post('/notificacoes',  (req, res) => controller.notificar(req, res));
router.get('/notificacoes',   (req, res) => controller.listar(req, res));

module.exports = router;
