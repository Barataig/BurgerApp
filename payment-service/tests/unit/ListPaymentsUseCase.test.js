// ================================================
// TDD — ListPaymentsUseCase
// ================================================

const { ListPaymentsUseCase } = require('../../src/usecases/PaymentUseCases');

const mockRepository = (payments = []) => ({
  salvar:            jest.fn(),
  buscarPorPedidoId: jest.fn(),
  listarTodos:       jest.fn(async () => payments),
});

describe('ListPaymentsUseCase', () => {

  it('deve retornar lista vazia quando não há pagamentos', async () => {
    const repo    = mockRepository([]);
    const useCase = new ListPaymentsUseCase(repo);

    const resultado = await useCase.executar();

    expect(resultado).toEqual([]);
    expect(repo.listarTodos).toHaveBeenCalledTimes(1);
  });

  it('deve retornar o resumo de cada pagamento', async () => {
    const pagamentoFake = {
      resumo: () => ({ id: 'pag-1', metodo: 'PIX', total: 40.00 }),
    };
    const repo    = mockRepository([pagamentoFake]);
    const useCase = new ListPaymentsUseCase(repo);

    const resultado = await useCase.executar();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].metodo).toBe('PIX');
  });

});
