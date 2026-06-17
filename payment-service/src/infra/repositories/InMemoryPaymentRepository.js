// ================================================
// CAMADA: Infra — Repository
// SOLID (DIP): implementa IPaymentRepository
// ================================================

const { IPaymentRepository } = require('../../domain/repositories/IPaymentRepository');

class InMemoryPaymentRepository extends IPaymentRepository {
  constructor() {
    super();
    this._store = new Map();
  }

  async salvar(payment) {
    this._store.set(payment.id, payment);
    return payment;
  }

  async buscarPorPedidoId(pedidoId) {
    const pagamentos = Array.from(this._store.values());
    return pagamentos.find(p => p.pedidoId === pedidoId) ?? null;
  }

  async listarTodos() {
    return Array.from(this._store.values());
  }
}

module.exports = { InMemoryPaymentRepository };
