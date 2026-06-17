// ================================================
// CAMADA: Use Cases + Repository Interface
// ================================================

// ── Interface do repositório ────────────────────
class INotificationRepository {
  async salvarTodos(notifications) {
    throw new Error('salvarTodos() não implementado');
  }

  async listarPorPedido(pedidoId) {
    throw new Error('listarPorPedido() não implementado');
  }

  async listarTodos() {
    throw new Error('listarTodos() não implementado');
  }
}

// ── Use Case: dispara notificações via Observer ─
const { SistemaPedido, ObservadorCliente, ObservadorCozinha } =
  require('../domain/patterns/NotificationObserver');

class NotifyUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async executar({ pedidoId, evento, hamburguer, adicionais, observacao, pagamento }) {
    const eventosValidos = ['PEDIDO_CONFIRMADO', 'PREPARO_INICIADO', 'PEDIDO_PRONTO'];

    if (!eventosValidos.includes(evento)) {
      throw new Error(`Evento inválido: "${evento}". Válidos: ${eventosValidos.join(', ')}`);
    }

    if (!pedidoId) throw new Error('pedidoId é obrigatório.');

    // OBSERVER: monta o sistema com os observadores registrados
    const sistema = new SistemaPedido();
    sistema
      .adicionarObservador(new ObservadorCliente())
      .adicionarObservador(new ObservadorCozinha());

    const dados = { pedidoId, hamburguer, adicionais, observacao, pagamento };
    const notificacoes = sistema.notificar(evento, dados).filter(Boolean);

    await this.notificationRepository.salvarTodos(notificacoes);
    return notificacoes.map(n => n.resumo());
  }
}

class ListNotificationsUseCase {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async executar(pedidoId) {
    if (pedidoId) {
      const notifs = await this.notificationRepository.listarPorPedido(pedidoId);
      return notifs.map(n => n.resumo());
    }
    const todas = await this.notificationRepository.listarTodos();
    return todas.map(n => n.resumo());
  }
}

module.exports = { INotificationRepository, NotifyUseCase, ListNotificationsUseCase };
