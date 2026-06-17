// ================================================
// CAMADA: Domain — Entity + Pattern
// PADRÃO: Observer
// SOLID (SRP): cada observador reage ao seu próprio evento
// SOLID (OCP): novo observador = nova classe, zero mudança no Subject
// ================================================

const { v4: uuidv4 } = require('uuid');

// ── Entidade ────────────────────────────────────
class Notification {
  constructor({ id, pedidoId, evento, destinatario, mensagem }) {
    this.id           = id || uuidv4();
    this.pedidoId     = pedidoId;
    this.evento       = evento;
    this.destinatario = destinatario;
    this.mensagem     = mensagem;
    this.criadoEm     = new Date().toISOString();
  }

  resumo() {
    return {
      id:           this.id,
      pedidoId:     this.pedidoId,
      evento:       this.evento,
      destinatario: this.destinatario,
      mensagem:     this.mensagem,
      criadoEm:     this.criadoEm,
    };
  }
}

// ── Interface base do Observer ──────────────────
class IObservador {
  // SOLID (ISP): contrato mínimo necessário
  atualizar(evento, dados) {
    throw new Error('atualizar() deve ser implementado pelo observador concreto.');
  }
}

// ── Subject: gerencia e notifica observadores ───
class SistemaPedido {
  constructor() {
    this._observadores = [];
  }

  adicionarObservador(obs) {
    this._observadores.push(obs);
    return this; // fluente
  }

  removerObservador(obs) {
    this._observadores = this._observadores.filter(o => o !== obs);
  }

  // SOLID (OCP): novos eventos não alteram este método
  notificar(evento, dados) {
    const notificacoes = [];
    this._observadores.forEach(obs => {
      const resultado = obs.atualizar(evento, dados);
      if (resultado) notificacoes.push(resultado);
    });
    return notificacoes;
  }
}

// ── Observadores concretos ──────────────────────

class ObservadorCliente extends IObservador {
  atualizar(evento, { pedidoId, hamburguer, pagamento }) {
    const mensagens = {
      PEDIDO_CONFIRMADO: `Seu pedido #${pedidoId} foi confirmado! ${hamburguer} — ${pagamento?.metodo ?? ''}`,
      PREPARO_INICIADO:  `Seu pedido #${pedidoId} entrou na cozinha! 🍳 Aguarde...`,
      PEDIDO_PRONTO:     `🔔 Pedido #${pedidoId} PRONTO! Retire no balcão.`,
    };

    if (!mensagens[evento]) return null;

    return new Notification({
      pedidoId,
      evento,
      destinatario: 'cliente',
      mensagem:     mensagens[evento],
    });
  }
}

class ObservadorCozinha extends IObservador {
  atualizar(evento, { pedidoId, hamburguer, adicionais = [], observacao }) {
    const extras  = adicionais.length ? ` + ${adicionais.join(', ')}` : '';
    const obs     = observacao ? ` | Obs: "${observacao}"` : '';

    const mensagens = {
      PEDIDO_CONFIRMADO: `Novo pedido #${pedidoId}: ${hamburguer}${extras}${obs}`,
      PREPARO_INICIADO:  `Iniciando preparo do pedido #${pedidoId}...`,
      PEDIDO_PRONTO:     `✅ Pedido #${pedidoId} finalizado e enviado ao balcão.`,
    };

    if (!mensagens[evento]) return null;

    return new Notification({
      pedidoId,
      evento,
      destinatario: 'cozinha',
      mensagem:     mensagens[evento],
    });
  }
}

module.exports = {
  Notification,
  SistemaPedido,
  ObservadorCliente,
  ObservadorCozinha,
};
