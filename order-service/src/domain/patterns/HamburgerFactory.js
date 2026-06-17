// ================================================
// CAMADA: Domain — Pattern
// PADRÃO: Factory
// SOLID (OCP): aberto para novos tipos sem alterar o existente
// SOLID (SRP): responsável apenas por criar hambúrgueres
// ================================================

const { Hamburger } = require('../entities/Hamburger');

const CARDAPIO = {
  classico: {
    id:           'classico',
    nome:         'Clássico',
    ingredientes: ['Pão', 'Carne 150g', 'Queijo', 'Alface', 'Tomate'],
    preco:        18.00,
  },
  duplo: {
    id:           'duplo',
    nome:         'Duplo',
    ingredientes: ['Pão Brioche', 'Carne 150g x2', 'Cheddar', 'Bacon', 'Cebola Caramelizada'],
    preco:        28.00,
  },
  vegano: {
    id:           'vegano',
    nome:         'Vegano',
    ingredientes: ['Pão Integral', 'Hambúrguer de Grão-de-Bico', 'Alface', 'Tomate', 'Maionese Vegana'],
    preco:        22.00,
  },
  frango: {
    id:           'frango',
    nome:         'Frango Crispy',
    ingredientes: ['Pão Australiano', 'Filé de Frango', 'Queijo Prato', 'Alface', 'Honey Mustard'],
    preco:        20.00,
  },
};

class HamburgerFactory {
  // SOLID (OCP): para adicionar novo tipo, basta incluir no CARDAPIO
  static criar(tipo) {
    const dados = CARDAPIO[tipo?.toLowerCase()];

    if (!dados) {
      throw new Error(
        `Tipo de hambúrguer inválido: "${tipo}". ` +
        `Disponíveis: ${HamburgerFactory.tiposDisponiveis().join(', ')}`
      );
    }

    return new Hamburger(dados);
  }

  static tiposDisponiveis() {
    return Object.keys(CARDAPIO);
  }

  static cardapio() {
    return Object.values(CARDAPIO);
  }
}

module.exports = { HamburgerFactory };
