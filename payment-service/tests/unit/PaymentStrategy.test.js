// ================================================
// TDD — PaymentStrategy
// ================================================

const {
  ProcessadorPagamento,
  PagamentoPix,
  PagamentoDebito,
  PagamentoCredito,
  PagamentoDinheiro,
} = require('../../src/domain/patterns/PaymentStrategy');

describe('PagamentoPix', () => {
  it('deve processar pagamento PIX e gerar chave', () => {
    const resultado = new PagamentoPix().processar(50.00);
    expect(resultado.metodo).toBe('PIX');
    expect(resultado.detalhe).toContain('BURGER-PIX-');
    expect(resultado.total).toBe(50.00);
  });
});

describe('PagamentoDebito', () => {
  it('deve processar pagamento no débito', () => {
    const resultado = new PagamentoDebito().processar(35.50);
    expect(resultado.metodo).toBe('Débito');
    expect(resultado.total).toBe(35.50);
  });
});

describe('PagamentoCredito', () => {
  it('deve processar à vista sem parcelas', () => {
    const resultado = new PagamentoCredito().processar(40.00, { parcelas: 1 });
    expect(resultado.metodo).toBe('Crédito');
    expect(resultado.detalhe).toContain('À vista');
  });

  it('deve processar parcelado em 3x', () => {
    const resultado = new PagamentoCredito().processar(30.00, { parcelas: 3 });
    expect(resultado.detalhe).toContain('3x de R$ 10.00');
  });

  it('deve assumir 1 parcela quando não informado', () => {
    const resultado = new PagamentoCredito().processar(20.00);
    expect(resultado.detalhe).toContain('À vista');
  });
});

describe('PagamentoDinheiro', () => {
  it('deve calcular troco corretamente', () => {
    const resultado = new PagamentoDinheiro().processar(25.00, { valorEntregue: 30.00 });
    expect(resultado.detalhe).toContain('Troco: R$ 5.00');
  });

  it('deve retornar sem troco quando valor exato', () => {
    const resultado = new PagamentoDinheiro().processar(25.00, { valorEntregue: 25.00 });
    expect(resultado.detalhe).toBe('Sem troco');
  });

  it('deve lançar erro para valor insuficiente', () => {
    expect(() => new PagamentoDinheiro().processar(50.00, { valorEntregue: 30.00 }))
      .toThrow('Valor insuficiente');
  });
});

describe('ProcessadorPagamento', () => {
  it('deve trocar estratégia em tempo de execução', () => {
    const processador = new ProcessadorPagamento();

    processador.setStrategy('pix');
    const pix = processador.executar(40.00);
    expect(pix.metodo).toBe('PIX');

    processador.setStrategy('debito');
    const debito = processador.executar(40.00);
    expect(debito.metodo).toBe('Débito');
  });

  it('deve lançar erro para método inválido', () => {
    const processador = new ProcessadorPagamento();
    expect(() => processador.setStrategy('boleto'))
      .toThrow('Método de pagamento inválido: "boleto"');
  });

  it('deve lançar erro ao executar sem estratégia definida', () => {
    const processador = new ProcessadorPagamento();
    expect(() => processador.executar(10.00))
      .toThrow('Nenhuma estratégia de pagamento definida.');
  });

  it('deve listar os 4 métodos disponíveis', () => {
    const metodos = ProcessadorPagamento.metodosDisponiveis();
    expect(metodos).toHaveLength(4);
    expect(metodos).toContain('pix');
    expect(metodos).toContain('dinheiro');
  });
});
