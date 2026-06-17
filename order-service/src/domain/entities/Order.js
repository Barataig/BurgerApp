// ================================================
// CAMADA: Domain — Entity
// SOLID (SRP): representa apenas o pedido e suas regras
// CLEAN CODE: métodos com nomes que revelam intenção
// ================================================

class Order {
  constructor({ id, hamburger, adicionais = [], observacao = '', status = 'pendente' }) {
    this.id         = id;
    this.hamburger  = hamburger;
    this.adicionais = adicionais;
    this.observacao = observacao;
    this.status     = status;
    this.criadoEm   = new Date().toISOString();
  }

  calcularTotal() {
    const totalAdicionais = this.adicionais.reduce(
      (soma, item) => soma + item.preco, 0
    );
    return this.hamburger.preco + totalAdicionais;
  }

  marcarEmPreparo() {
    this.status = 'em_preparo';
  }

  marcarPronto() {
    this.status = 'pronto';
  }

  estaCompleto() {
    return this.status === 'pronto';
  }

  resumo() {
    return {
      id:         this.id,
      hamburger:  this.hamburger.nome,
      adicionais: this.adicionais.map(a => a.nome),
      observacao: this.observacao,
      total:      this.calcularTotal(),
      status:     this.status,
      criadoEm:   this.criadoEm,
    };
  }
}

module.exports = { Order };
