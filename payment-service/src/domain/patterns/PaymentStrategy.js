// ================================================
// CAMADA: Domain — Pattern
// PADRÃO: Strategy
// SOLID (OCP): novo método = nova classe, sem alterar existentes
// SOLID (LSP): todas as estratégias substituem a interface base
// SOLID (SRP): cada classe processa apenas seu método de pagamento
// ================================================

// ── Interface base (contrato) ──────────────────
class PagamentoStrategy {
  // SOLID (ISP): interface com método único e coeso
  processar(total, opcoes = {}) {
    throw new Error('processar() deve ser implementado pela estratégia concreta.');
  }
}

// ── Estratégias concretas ──────────────────────

class PagamentoPix extends PagamentoStrategy {
  processar(total) {
    const chave = `BURGER-PIX-${Date.now()}`;
    return {
      metodo:  'PIX',
      detalhe: `Chave gerada: ${chave}`,
      total,
    };
  }
}

class PagamentoDebito extends PagamentoStrategy {
  processar(total) {
    return {
      metodo:  'Débito',
      detalhe: `Débito à vista: R$ ${total.toFixed(2)}`,
      total,
    };
  }
}

class PagamentoCredito extends PagamentoStrategy {
  processar(total, opcoes = {}) {
    const parcelas    = parseInt(opcoes.parcelas) || 1;
    const valorParcela = (total / parcelas).toFixed(2);

    return {
      metodo:  'Crédito',
      detalhe: parcelas > 1
        ? `${parcelas}x de R$ ${valorParcela}`
        : `À vista: R$ ${total.toFixed(2)}`,
      total,
    };
  }
}

class PagamentoDinheiro extends PagamentoStrategy {
  processar(total, opcoes = {}) {
    const valorEntregue = parseFloat(opcoes.valorEntregue) || 0;

    if (valorEntregue < total) {
      throw new Error(
        `Valor insuficiente. Total: R$ ${total.toFixed(2)}, ` +
        `Entregue: R$ ${valorEntregue.toFixed(2)}, ` +
        `Faltam: R$ ${(total - valorEntregue).toFixed(2)}`
      );
    }

    const troco = (valorEntregue - total).toFixed(2);
    return {
      metodo:  'Dinheiro',
      detalhe: troco > 0 ? `Troco: R$ ${troco}` : 'Sem troco',
      total,
    };
  }
}

// ── Contexto: delega para a estratégia ativa ──

class ProcessadorPagamento {
  constructor() {
    this._strategy = null;
  }

  // SOLID (OCP): adicionar novo método = incluir no mapa
  setStrategy(metodo) {
    const estrategias = {
      pix:      new PagamentoPix(),
      debito:   new PagamentoDebito(),
      credito:  new PagamentoCredito(),
      dinheiro: new PagamentoDinheiro(),
    };

    if (!estrategias[metodo]) {
      throw new Error(
        `Método de pagamento inválido: "${metodo}". ` +
        `Disponíveis: ${Object.keys(estrategias).join(', ')}`
      );
    }

    this._strategy = estrategias[metodo];
  }

  executar(total, opcoes = {}) {
    if (!this._strategy) {
      throw new Error('Nenhuma estratégia de pagamento definida.');
    }
    return this._strategy.processar(total, opcoes);
  }

  static metodosDisponiveis() {
    return ['pix', 'debito', 'credito', 'dinheiro'];
  }
}

module.exports = {
  ProcessadorPagamento,
  PagamentoPix,
  PagamentoDebito,
  PagamentoCredito,
  PagamentoDinheiro,
};
