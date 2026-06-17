// ================================================
// CAMADA: Domain — Entity
// CLEAN CODE: nomes expressivos, responsabilidade única
// SOLID (SRP): representa apenas o conceito de Hambúrguer
// ================================================

class Hamburger {
  constructor({ id, nome, ingredientes, preco }) {
    this.id          = id;
    this.nome        = nome;
    this.ingredientes = ingredientes;
    this.preco       = preco;
  }

  descricao() {
    return `${this.nome} (R$ ${this.preco.toFixed(2)})`;
  }
}

module.exports = { Hamburger };
