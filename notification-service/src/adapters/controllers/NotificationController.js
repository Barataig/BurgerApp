// ================================================
// CAMADA: Adapters — Controller
// ================================================

const { NotifyUseCase, ListNotificationsUseCase } = require('../../usecases/NotificationUseCases');

class NotificationController {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async notificar(req, res) {
    try {
      const { pedidoId, evento, hamburguer, adicionais, observacao, pagamento } = req.body;

      if (!pedidoId || !evento) {
        return res.status(400).json({ erro: 'pedidoId e evento são obrigatórios.' });
      }

      const useCase       = new NotifyUseCase(this.notificationRepository);
      const notificacoes  = await useCase.executar({ pedidoId, evento, hamburguer, adicionais, observacao, pagamento });

      return res.status(201).json({ sucesso: true, notificacoes });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const useCase      = new ListNotificationsUseCase(this.notificationRepository);
      const notificacoes = await useCase.executar(req.query.pedidoId);

      return res.status(200).json({ sucesso: true, notificacoes });
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = { NotificationController };
