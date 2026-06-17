// ================================================
// CAMADA: Domain — Entity
// SOLID (SRP): representa apenas o conceito de Pagamento
// CLEAN CODE: nomes expressivos, sem abreviações
// ================================================

class Payment {
  constructor({ id, pedidoId, metodo, total, detalhe, status = 'aprovado' }) {
    this.id        = id;
    this.pedidoId  = pedidoId;
    this.metodo    = metodo;
    this.total     = total;
    this.detalhe   = detalhe;
    this.status    = status;
    this.criadoEm  = new Date().toISOString();
  }

  foiAprovado() {
    return this.status === 'aprovado';
  }

  resumo() {
    return {
      id:       this.id,
      pedidoId: this.pedidoId,
      metodo:   this.metodo,
      total:    this.total,
      detalhe:  this.detalhe,
      status:   this.status,
      criadoEm: this.criadoEm,
    };
  }
}

module.exports = { Payment };
