// ================================================
// TDD — OrderBuilder
// ================================================

const { OrderBuilder }     = require('../../src/domain/patterns/OrderBuilder');
const { HamburgerFactory } = require('../../src/domain/patterns/HamburgerFactory');
const { Order }            = require('../../src/domain/entities/Order');

describe('OrderBuilder', () => {
  let burger;

  beforeEach(() => {
    burger = HamburgerFactory.criar('classico');
  });

  describe('build()', () => {
    it('deve construir pedido simples com hambúrguer', () => {
      const pedido = new OrderBuilder()
        .comHamburguer(burger)
        .build();

      expect(pedido).toBeInstanceOf(Order);
      expect(pedido.hamburger.nome).toBe('Clássico');
      expect(pedido.adicionais).toHaveLength(0);
    });

    it('deve lançar erro ao fazer build sem hambúrguer', () => {
      expect(() => new OrderBuilder().build())
        .toThrow('Pedido inválido: é necessário informar um hambúrguer.');
    });

    it('deve adicionar adicionais corretamente', () => {
      const pedido = new OrderBuilder()
        .comHamburguer(burger)
        .comAdicional('bacon')
        .comAdicional('batata')
        .build();

      expect(pedido.adicionais).toHaveLength(2);
      expect(pedido.adicionais[0].nome).toBe('Bacon Crocante');
    });

    it('deve lançar erro para adicional inválido', () => {
      expect(() =>
        new OrderBuilder()
          .comHamburguer(burger)
          .comAdicional('invalido')
          .build()
      ).toThrow('Adicional inválido: "invalido"');
    });

    it('deve registrar observação no pedido', () => {
      const pedido = new OrderBuilder()
        .comHamburguer(burger)
        .comObservacao('sem cebola')
        .build();

      expect(pedido.observacao).toBe('sem cebola');
    });

    it('deve ignorar espaços extras na observação', () => {
      const pedido = new OrderBuilder()
        .comHamburguer(burger)
        .comObservacao('  sem cebola  ')
        .build();

      expect(pedido.observacao).toBe('sem cebola');
    });

    it('deve gerar id único para cada pedido', () => {
      const pedido1 = new OrderBuilder().comHamburguer(burger).build();
      const pedido2 = new OrderBuilder().comHamburguer(burger).build();

      expect(pedido1.id).not.toBe(pedido2.id);
    });
  });

  describe('calcularTotal()', () => {
    it('deve calcular total apenas com hambúrguer', () => {
      const pedido = new OrderBuilder().comHamburguer(burger).build();
      expect(pedido.calcularTotal()).toBe(18.00);
    });

    it('deve somar adicionais ao total', () => {
      const pedido = new OrderBuilder()
        .comHamburguer(burger)
        .comAdicional('bacon')  // +4.00
        .comAdicional('batata') // +8.00
        .build();

      expect(pedido.calcularTotal()).toBe(30.00); // 18 + 4 + 8
    });
  });

  describe('encadeamento fluente', () => {
    it('deve permitir encadear todos os métodos', () => {
      expect(() => {
        new OrderBuilder()
          .comHamburguer(burger)
          .comAdicional('bacon')
          .comAdicional('ovo')
          .comObservacao('bem passado')
          .build();
      }).not.toThrow();
    });
  });

});
