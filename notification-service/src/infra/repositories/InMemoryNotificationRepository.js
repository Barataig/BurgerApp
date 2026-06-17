// ================================================
// CAMADA: Infra — InMemoryNotificationRepository
// ================================================

const { INotificationRepository } = require('../../usecases/NotificationUseCases');

class InMemoryNotificationRepository extends INotificationRepository {
  constructor() {
    super();
    this._store = [];
  }

  async salvarTodos(notifications) {
    this._store.push(...notifications);
    return notifications;
  }

  async listarPorPedido(pedidoId) {
    return this._store.filter(n => n.pedidoId === pedidoId);
  }

  async listarTodos() {
    return [...this._store];
  }
}

module.exports = { InMemoryNotificationRepository };
