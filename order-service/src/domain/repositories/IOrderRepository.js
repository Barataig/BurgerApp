// ================================================
// CAMADA: Domain — Repository Interface
// SOLID (DIP): casos de uso dependem desta abstração,
//              não da implementação concreta (InMemory, DB, etc)
// SOLID (ISP): interface enxuta com só o necessário
// ================================================

class IOrderRepository {
  async salvar(order) {
    throw new Error('salvar() não implementado');
  }

  async buscarPorId(id) {
    throw new Error('buscarPorId() não implementado');
  }

  async listarTodos() {
    throw new Error('listarTodos() não implementado');
  }

  async atualizar(order) {
    throw new Error('atualizar() não implementado');
  }
}

module.exports = { IOrderRepository };
