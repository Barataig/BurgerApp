// ================================================
// CAMADA: Adapters — Controller
// SOLID (SRP): traduz HTTP ↔ casos de uso
// ================================================

const { ProcessPaymentUseCase, GetPaymentByOrderUseCase, ListPaymentsUseCase } = require('../../usecases/PaymentUseCases');
const { ProcessadorPagamento } = require('../../domain/patterns/PaymentStrategy');

class PaymentController {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async processarPagamento(req, res) {
    try {
      const { pedidoId, metodo, total, opcoes } = req.body;

      if (!pedidoId || !metodo || !total) {
        return res.status(400).json({
          erro: 'Campos obrigatórios: pedidoId, metodo, total.',
        });
      }

      const useCase  = new ProcessPaymentUseCase(this.paymentRepository);
      const payment  = await useCase.executar({ pedidoId, metodo, total, opcoes });

      return res.status(201).json({ sucesso: true, payment });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async buscarPorPedido(req, res) {
    try {
      const useCase = new GetPaymentByOrderUseCase(this.paymentRepository);
      const payment = await useCase.executar(req.params.pedidoId);

      return res.status(200).json({ sucesso: true, payment });
    } catch (erro) {
      return res.status(404).json({ erro: erro.message });
    }
  }

  async listarPagamentos(req, res) {
    try {
      const useCase  = new ListPaymentsUseCase(this.paymentRepository);
      const payments = await useCase.executar();

      return res.status(200).json({ sucesso: true, payments });
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  async listarMetodos(req, res) {
    return res.status(200).json({
      sucesso: true,
      metodos: ProcessadorPagamento.metodosDisponiveis(),
    });
  }
}

module.exports = { PaymentController };
