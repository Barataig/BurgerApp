// ================================================
// BDD — Step Definitions (Cucumber) — Payment
// ================================================

const { Given, When, Then } = require('@cucumber/cucumber');
const assert                = require('assert');
const { ProcessPaymentUseCase } = require('../../../src/usecases/PaymentUseCases');
const { InMemoryPaymentRepository } = require('../../../src/infra/repositories/InMemoryPaymentRepository');

let pedidoId;
let total;
let metodo;
let opcoes = {};
let resultado;
let erroCapturado;

Given('que o pedido {string} tem total de {float}', function (id, valor) {
  pedidoId      = id;
  total         = valor;
  opcoes        = {};
  resultado     = null;
  erroCapturado = null;
});

When('o pagamento for processado via {string}', async function (met) {
  metodo = met;
  const repo    = new InMemoryPaymentRepository();
  const useCase = new ProcessPaymentUseCase(repo);

  try {
    resultado = await useCase.executar({ pedidoId, metodo, total, opcoes });
  } catch (erro) {
    erroCapturado = erro;
  }
});

When('o pagamento for processado via {string} com valor entregue de {float}', async function (met, valorEntregue) {
  metodo = met;
  opcoes = { valorEntregue };
  const repo    = new InMemoryPaymentRepository();
  const useCase = new ProcessPaymentUseCase(repo);

  try {
    resultado = await useCase.executar({ pedidoId, metodo, total, opcoes });
  } catch (erro) {
    erroCapturado = erro;
  }
});

When('o pagamento for processado via {string} em {int} parcelas', async function (met, parcelas) {
  metodo = met;
  opcoes = { parcelas };
  const repo    = new InMemoryPaymentRepository();
  const useCase = new ProcessPaymentUseCase(repo);

  try {
    resultado = await useCase.executar({ pedidoId, metodo, total, opcoes });
  } catch (erro) {
    erroCapturado = erro;
  }
});

Then('o pagamento deve ser aprovado', function () {
  assert.ok(resultado, 'Resultado não encontrado');
  assert.strictEqual(resultado.status, 'aprovado');
});

Then('o método registrado deve ser {string}', function (metodoEsperado) {
  assert.strictEqual(resultado.metodo, metodoEsperado);
});

Then('o detalhe deve conter {string}', function (texto) {
  assert.ok(
    resultado.detalhe.includes(texto),
    `Esperado "${texto}" no detalhe, mas recebeu: "${resultado.detalhe}"`
  );
});

Then('o sistema deve retornar erro de método inválido', function () {
  assert.ok(erroCapturado, 'Deveria ter lançado um erro');
  assert.ok(
    erroCapturado.message.includes('inválido'),
    `Mensagem inesperada: ${erroCapturado.message}`
  );
});
