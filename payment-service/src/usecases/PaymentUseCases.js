// ================================================
// CAMADA: Use Cases
// SOLID (SRP): orquestra apenas o processamento de pagamento
// SOLID (DIP): recebe repositório por injeção de dependência
// ================================================

const { v4: uuidv4 }            = require('uuid');
const { ProcessadorPagamento }  = require('../domain/patterns/PaymentStrategy');
const { Payment }               = require('../domain/entities/Payment');

class ProcessPaymentUseCase {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async executar({ pedidoId, metodo, total, opcoes = {} }) {
    if (!pedidoId) throw new Error('pedidoId é obrigatório.');
    if (!metodo)   throw new Error('metodo é obrigatório.');
    if (!total || total <= 0) throw new Error('total deve ser maior que zero.');

    // STRATEGY: processa com a estratégia correta
    const processador = new ProcessadorPagamento();
    processador.setStrategy(metodo);
    const resultado = processador.executar(total, opcoes);

    const payment = new Payment({
      id:       uuidv4(),
      pedidoId,
      metodo:   resultado.metodo,
      total:    resultado.total,
      detalhe:  resultado.detalhe,
      status:   'aprovado',
    });

    await this.paymentRepository.salvar(payment);
    return payment.resumo();
  }
}

class GetPaymentByOrderUseCase {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async executar(pedidoId) {
    const payment = await this.paymentRepository.buscarPorPedidoId(pedidoId);

    if (!payment) {
      throw new Error(`Pagamento não encontrado para o pedido: ${pedidoId}`);
    }

    return payment.resumo();
  }
}

class ListPaymentsUseCase {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async executar() {
    const payments = await this.paymentRepository.listarTodos();
    return payments.map(p => p.resumo());
  }
}

module.exports = { ProcessPaymentUseCase, GetPaymentByOrderUseCase, ListPaymentsUseCase };
