// ================================================
// TDD — ProcessPaymentUseCase
// ================================================

const { ProcessPaymentUseCase } = require('../../src/usecases/PaymentUseCases');

const mockRepository = () => ({
  salvar:            jest.fn(async (p) => p),
  buscarPorPedidoId: jest.fn(async () => null),
  listarTodos:       jest.fn(async () => []),
});

describe('ProcessPaymentUseCase', () => {

  it('deve processar pagamento PIX com sucesso', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    const resultado = await useCase.executar({
      pedidoId: 'pedido-123',
      metodo:   'pix',
      total:    48.00,
    });

    expect(resultado).toHaveProperty('id');
    expect(resultado.metodo).toBe('PIX');
    expect(resultado.total).toBe(48.00);
    expect(resultado.status).toBe('aprovado');
    expect(repo.salvar).toHaveBeenCalledTimes(1);
  });

  it('deve processar pagamento em dinheiro com troco', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    const resultado = await useCase.executar({
      pedidoId: 'pedido-456',
      metodo:   'dinheiro',
      total:    22.00,
      opcoes:   { valorEntregue: 30.00 },
    });

    expect(resultado.detalhe).toContain('Troco: R$ 8.00');
  });

  it('deve processar crédito parcelado', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    const resultado = await useCase.executar({
      pedidoId: 'pedido-789',
      metodo:   'credito',
      total:    30.00,
      opcoes:   { parcelas: 3 },
    });

    expect(resultado.detalhe).toContain('3x');
  });

  it('deve lançar erro para método inválido', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    await expect(useCase.executar({
      pedidoId: 'pedido-001',
      metodo:   'boleto',
      total:    10.00,
    })).rejects.toThrow('Método de pagamento inválido');
  });

  it('deve lançar erro quando pedidoId ausente', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    await expect(useCase.executar({ metodo: 'pix', total: 10.00 }))
      .rejects.toThrow('pedidoId é obrigatório.');
  });

  it('deve lançar erro quando total é zero', async () => {
    const repo    = mockRepository();
    const useCase = new ProcessPaymentUseCase(repo);

    await expect(useCase.executar({ pedidoId: 'x', metodo: 'pix', total: 0 }))
      .rejects.toThrow('total deve ser maior que zero.');
  });

});
