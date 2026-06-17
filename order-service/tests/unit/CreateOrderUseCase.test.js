// ================================================
// TDD — CreateOrderUseCase
// Mock do repositório via injeção de dependência (SOLID DIP)
// ================================================

const { CreateOrderUseCase } = require('../../src/usecases/CreateOrderUseCase');

// Mock simples do repositório — sem dependência de banco
const mockRepository = () => ({
  salvar:       jest.fn(async (order) => order),
  buscarPorId:  jest.fn(),
  listarTodos:  jest.fn(async () => []),
  atualizar:    jest.fn(),
});

describe('CreateOrderUseCase', () => {

  it('deve criar pedido com tipo válido', async () => {
    const repo    = mockRepository();
    const useCase = new CreateOrderUseCase(repo);

    const resultado = await useCase.executar({ tipoBurguer: 'classico' });

    expect(resultado).toHaveProperty('id');
    expect(resultado.hamburger).toBe('Clássico');
    expect(resultado.status).toBe('pendente');
    expect(repo.salvar).toHaveBeenCalledTimes(1);
  });

  it('deve criar pedido com adicionais', async () => {
    const repo    = mockRepository();
    const useCase = new CreateOrderUseCase(repo);

    const resultado = await useCase.executar({
      tipoBurguer: 'duplo',
      adicionais:  ['bacon', 'batata'],
      observacao:  'sem cebola',
    });

    expect(resultado.adicionais).toContain('Bacon Crocante');
    expect(resultado.adicionais).toContain('Batata Frita');
    expect(resultado.observacao).toBe('sem cebola');
  });

  it('deve calcular total corretamente', async () => {
    const repo    = mockRepository();
    const useCase = new CreateOrderUseCase(repo);

    const resultado = await useCase.executar({
      tipoBurguer: 'classico',  // R$ 18,00
      adicionais:  ['bacon'],   // + R$ 4,00
    });

    expect(resultado.total).toBe(22.00);
  });

  it('deve lançar erro para tipo inválido', async () => {
    const repo    = mockRepository();
    const useCase = new CreateOrderUseCase(repo);

    await expect(useCase.executar({ tipoBurguer: 'invalido' }))
      .rejects.toThrow('Tipo de hambúrguer inválido');
  });

  it('não deve chamar repositório se tipo for inválido', async () => {
    const repo    = mockRepository();
    const useCase = new CreateOrderUseCase(repo);

    try {
      await useCase.executar({ tipoBurguer: 'invalido' });
    } catch (_) {}

    expect(repo.salvar).not.toHaveBeenCalled();
  });

});
