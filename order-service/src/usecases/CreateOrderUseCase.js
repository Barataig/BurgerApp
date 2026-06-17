// ================================================
// CAMADA: Use Cases
// SOLID (SRP): orquestra apenas a criação de pedidos
// SOLID (DIP): recebe o repositório por injeção de dependência
// CLEAN CODE: função única, nome revela intenção
// ================================================

const { HamburgerFactory } = require('../domain/patterns/HamburgerFactory');
const { OrderBuilder }     = require('../domain/patterns/OrderBuilder');

class CreateOrderUseCase {
  // SOLID (DIP): depende da interface, não da implementação
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async executar({ tipoBurguer, adicionais = [], observacao = '' }) {
    // 1. FACTORY: cria o hambúrguer pelo tipo
    const hamburger = HamburgerFactory.criar(tipoBurguer);

    // 2. BUILDER: monta o pedido de forma fluente
    const builder = new OrderBuilder().comHamburguer(hamburger);

    adicionais.forEach(id => builder.comAdicional(id));
    builder.comObservacao(observacao);

    const order = builder.build();

    // 3. Persiste via repositório (sem saber como)
    await this.orderRepository.salvar(order);

    return order.resumo();
  }
}

module.exports = { CreateOrderUseCase };
