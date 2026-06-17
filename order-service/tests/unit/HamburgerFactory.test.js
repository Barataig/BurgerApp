// ================================================
// TDD — HamburgerFactory
// Testes escritos ANTES da implementação (Red → Green → Refactor)
// ================================================

const { HamburgerFactory } = require('../../src/domain/patterns/HamburgerFactory');
const { Hamburger }        = require('../../src/domain/entities/Hamburger');

describe('HamburgerFactory', () => {

  describe('criar()', () => {
    it('deve criar um hambúrguer Clássico com preço correto', () => {
      const burger = HamburgerFactory.criar('classico');
      expect(burger).toBeInstanceOf(Hamburger);
      expect(burger.nome).toBe('Clássico');
      expect(burger.preco).toBe(18.00);
    });

    it('deve criar um hambúrguer Duplo com ingredientes corretos', () => {
      const burger = HamburgerFactory.criar('duplo');
      expect(burger.nome).toBe('Duplo');
      expect(burger.ingredientes).toContain('Bacon');
    });

    it('deve criar hambúrguer Vegano', () => {
      const burger = HamburgerFactory.criar('vegano');
      expect(burger.preco).toBe(22.00);
    });

    it('deve criar hambúrguer Frango Crispy', () => {
      const burger = HamburgerFactory.criar('frango');
      expect(burger.nome).toBe('Frango Crispy');
    });

    it('deve lançar erro para tipo inválido', () => {
      expect(() => HamburgerFactory.criar('invalido'))
        .toThrow('Tipo de hambúrguer inválido: "invalido"');
    });

    it('deve lançar erro quando tipo é nulo', () => {
      expect(() => HamburgerFactory.criar(null))
        .toThrow();
    });

    it('deve aceitar tipo em maiúsculo', () => {
      const burger = HamburgerFactory.criar('CLASSICO');
      expect(burger.nome).toBe('Clássico');
    });
  });

  describe('tiposDisponiveis()', () => {
    it('deve retornar os 4 tipos disponíveis', () => {
      const tipos = HamburgerFactory.tiposDisponiveis();
      expect(tipos).toHaveLength(4);
      expect(tipos).toContain('classico');
      expect(tipos).toContain('duplo');
      expect(tipos).toContain('vegano');
      expect(tipos).toContain('frango');
    });
  });

  describe('cardapio()', () => {
    it('deve retornar lista com todos os hambúrgueres', () => {
      const cardapio = HamburgerFactory.cardapio();
      expect(cardapio).toHaveLength(4);
      expect(cardapio[0]).toHaveProperty('preco');
      expect(cardapio[0]).toHaveProperty('ingredientes');
    });
  });

});
