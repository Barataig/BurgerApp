// ================================================
// TDD — NotificationObserver (Observer Pattern)
// ================================================

const {
  SistemaPedido,
  ObservadorCliente,
  ObservadorCozinha,
} = require('../../src/domain/patterns/NotificationObserver');

const dadosPedido = {
  pedidoId:   'pedido-001',
  hamburguer: 'Duplo',
  adicionais: ['Bacon Crocante', 'Batata Frita'],
  observacao: 'sem cebola',
  pagamento:  { metodo: 'PIX' },
};

describe('ObservadorCliente', () => {
  const obs = new ObservadorCliente();

  it('deve gerar notificação para PEDIDO_CONFIRMADO', () => {
    const notif = obs.atualizar('PEDIDO_CONFIRMADO', dadosPedido);
    expect(notif.destinatario).toBe('cliente');
    expect(notif.mensagem).toContain('pedido-001');
    expect(notif.mensagem).toContain('PIX');
  });

  it('deve gerar notificação para PREPARO_INICIADO', () => {
    const notif = obs.atualizar('PREPARO_INICIADO', dadosPedido);
    expect(notif.mensagem).toContain('cozinha');
  });

  it('deve gerar notificação para PEDIDO_PRONTO', () => {
    const notif = obs.atualizar('PEDIDO_PRONTO', dadosPedido);
    expect(notif.mensagem).toContain('PRONTO');
  });

  it('deve retornar null para evento desconhecido', () => {
    const notif = obs.atualizar('EVENTO_INVALIDO', dadosPedido);
    expect(notif).toBeNull();
  });
});

describe('ObservadorCozinha', () => {
  const obs = new ObservadorCozinha();

  it('deve incluir adicionais na notificação', () => {
    const notif = obs.atualizar('PEDIDO_CONFIRMADO', dadosPedido);
    expect(notif.destinatario).toBe('cozinha');
    expect(notif.mensagem).toContain('Bacon Crocante');
  });

  it('deve incluir observação na notificação', () => {
    const notif = obs.atualizar('PEDIDO_CONFIRMADO', dadosPedido);
    expect(notif.mensagem).toContain('sem cebola');
  });

  it('deve gerar notificação de preparo', () => {
    const notif = obs.atualizar('PREPARO_INICIADO', dadosPedido);
    expect(notif.mensagem).toContain('preparo');
  });
});

describe('SistemaPedido', () => {
  it('deve notificar todos os observadores registrados', () => {
    const sistema = new SistemaPedido();
    sistema
      .adicionarObservador(new ObservadorCliente())
      .adicionarObservador(new ObservadorCozinha());

    const notificacoes = sistema.notificar('PEDIDO_CONFIRMADO', dadosPedido);
    expect(notificacoes).toHaveLength(2);
    expect(notificacoes.map(n => n.destinatario)).toContain('cliente');
    expect(notificacoes.map(n => n.destinatario)).toContain('cozinha');
  });

  it('deve permitir adicionar observadores de forma fluente', () => {
    const sistema = new SistemaPedido();
    expect(() =>
      sistema
        .adicionarObservador(new ObservadorCliente())
        .adicionarObservador(new ObservadorCozinha())
    ).not.toThrow();
  });

  it('deve funcionar sem observadores registrados', () => {
    const sistema = new SistemaPedido();
    const notifs  = sistema.notificar('PEDIDO_CONFIRMADO', dadosPedido);
    expect(notifs).toHaveLength(0);
  });
});
