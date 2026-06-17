// ================================================
// CAMADA: Infra — Repository
// SOLID (DIP): implementa IOrderRepository
// SOLID (OCP): pode ser trocado por MongoDB/Postgres
//              sem alterar os casos de uso
// ================================================

const { IOrderRepository } = require('../../domain/repositories/IOrderRepository');

class InMemoryOrderRepository extends IOrderRepository {
  constructor() {
    super();
    this._store = new Map();
  }

  async salvar(order) {
    this._store.set(order.id, order);
    return order;
  }

  async buscarPorId(id) {
    return this._store.get(id) ?? null;
  }

  async listarTodos() {
    return Array.from(this._store.values());
  }

  async atualizar(order) {
    if (!this._store.has(order.id)) {
      throw new Error(`Pedido não encontrado para atualização: ${order.id}`);
    }
    this._store.set(order.id, order);
    return order;
  }
}

module.exports = { InMemoryOrderRepository };
