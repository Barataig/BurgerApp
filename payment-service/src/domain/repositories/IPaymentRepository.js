// ================================================
// CAMADA: Domain — Repository Interface
// SOLID (DIP): casos de uso dependem desta abstração
// SOLID (ISP): interface enxuta com só o necessário
// ================================================

class IPaymentRepository {
  async salvar(payment) {
    throw new Error('salvar() não implementado');
  }

  async buscarPorPedidoId(pedidoId) {
    throw new Error('buscarPorPedidoId() não implementado');
  }

  async listarTodos() {
    throw new Error('listarTodos() não implementado');
  }
}

module.exports = { IPaymentRepository };
