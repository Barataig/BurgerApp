// ================================================
// CAMADA: Use Cases
// SOLID (SRP): cada caso de uso com responsabilidade única
// SOLID (DIP): recebe repositório por injeção
// ================================================

class ListOrdersUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async executar() {
    const orders = await this.orderRepository.listarTodos();
    return orders.map(order => order.resumo());
  }
}

class GetOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async executar(id) {
    const order = await this.orderRepository.buscarPorId(id);

    if (!order) {
      throw new Error(`Pedido não encontrado: ${id}`);
    }

    return order.resumo();
  }
}

class UpdateOrderStatusUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async executar(id, novoStatus) {
    const order = await this.orderRepository.buscarPorId(id);

    if (!order) {
      throw new Error(`Pedido não encontrado: ${id}`);
    }

    const statusValidos = ['pendente', 'em_preparo', 'pronto'];
    if (!statusValidos.includes(novoStatus)) {
      throw new Error(`Status inválido: "${novoStatus}". Válidos: ${statusValidos.join(', ')}`);
    }

    if (novoStatus === 'em_preparo') order.marcarEmPreparo();
    if (novoStatus === 'pronto')     order.marcarPronto();

    await this.orderRepository.atualizar(order);
    return order.resumo();
  }
}

module.exports = { ListOrdersUseCase, GetOrderUseCase, UpdateOrderStatusUseCase };
