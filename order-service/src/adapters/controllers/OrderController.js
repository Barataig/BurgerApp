// ================================================
// CAMADA: Adapters — Controller
// SOLID (SRP): traduz HTTP ↔ casos de uso
// CLEAN CODE: funções pequenas, nomes expressivos
// ================================================

const { CreateOrderUseCase }                                      = require('../../usecases/CreateOrderUseCase');
const { ListOrdersUseCase, GetOrderUseCase, UpdateOrderStatusUseCase } = require('../../usecases/OrderUseCases');
const { HamburgerFactory }                                        = require('../../domain/patterns/HamburgerFactory');
const { OrderBuilder }                                            = require('../../domain/patterns/OrderBuilder');

class OrderController {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async criarPedido(req, res) {
    try {
      const { tipoBurguer, adicionais, observacao } = req.body;

      if (!tipoBurguer) {
        return res.status(400).json({ erro: 'tipoBurguer é obrigatório.' });
      }

      const useCase = new CreateOrderUseCase(this.orderRepository);
      const pedido  = await useCase.executar({ tipoBurguer, adicionais, observacao });

      return res.status(201).json({ sucesso: true, pedido });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarPedidos(req, res) {
    try {
      const useCase = new ListOrdersUseCase(this.orderRepository);
      const pedidos = await useCase.executar();

      return res.status(200).json({ sucesso: true, pedidos });
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  async buscarPedido(req, res) {
    try {
      const useCase = new GetOrderUseCase(this.orderRepository);
      const pedido  = await useCase.executar(req.params.id);

      return res.status(200).json({ sucesso: true, pedido });
    } catch (erro) {
      return res.status(404).json({ erro: erro.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      const useCase    = new UpdateOrderStatusUseCase(this.orderRepository);
      const pedido     = await useCase.executar(req.params.id, status);

      return res.status(200).json({ sucesso: true, pedido });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarCardapio(req, res) {
    return res.status(200).json({
      sucesso:    true,
      burgers:    HamburgerFactory.cardapio(),
      adicionais: OrderBuilder.listarAdicionais(),
    });
  }
}

module.exports = { OrderController };
