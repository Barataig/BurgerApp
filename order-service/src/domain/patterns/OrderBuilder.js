// ================================================
// CAMADA: Domain — Pattern
// PADRÃO: Builder
// SOLID (SRP): responsável apenas por construir pedidos
// CLEAN CODE: encadeamento fluente, nomes revelam intenção
// ================================================

const { v4: uuidv4 } = require('uuid');
const { Order }      = require('../entities/Order');

const ADICIONAIS_DISPONIVEIS = {
  bacon:   { id: 'bacon',   nome: 'Bacon Crocante',  preco: 4.00 },
  cheddar: { id: 'cheddar', nome: 'Cheddar Extra',   preco: 3.00 },
  ovo:     { id: 'ovo',     nome: 'Ovo Frito',       preco: 2.50 },
  batata:  { id: 'batata',  nome: 'Batata Frita',    preco: 8.00 },
  refri:   { id: 'refri',   nome: 'Refrigerante',    preco: 5.00 },
  molho:   { id: 'molho',   nome: 'Molho Especial',  preco: 1.50 },
};

class OrderBuilder {
  constructor() {
    this._hamburger  = null;
    this._adicionais = [];
    this._observacao = '';
  }

  comHamburguer(hamburger) {
    this._hamburger = hamburger;
    return this; // fluente
  }

  comAdicional(id) {
    const adicional = ADICIONAIS_DISPONIVEIS[id];

    if (!adicional) {
      throw new Error(`Adicional inválido: "${id}". Disponíveis: ${OrderBuilder.adicionaisDisponiveis().join(', ')}`);
    }

    this._adicionais.push(adicional);
    return this; // fluente
  }

  comObservacao(texto) {
    this._observacao = texto?.trim() ?? '';
    return this; // fluente
  }

  build() {
    if (!this._hamburger) {
      throw new Error('Pedido inválido: é necessário informar um hambúrguer.');
    }

    return new Order({
      id:         uuidv4(),
      hamburger:  this._hamburger,
      adicionais: [...this._adicionais],
      observacao: this._observacao,
      status:     'pendente',
    });
  }

  static adicionaisDisponiveis() {
    return Object.keys(ADICIONAIS_DISPONIVEIS);
  }

  static listarAdicionais() {
    return Object.values(ADICIONAIS_DISPONIVEIS);
  }
}

module.exports = { OrderBuilder };
