// ================================================
// BDD — Step Definitions (Cucumber)
// Conecta os cenários .feature com código real
// ================================================

const { Given, When, Then } = require('@cucumber/cucumber');
const assert                = require('assert');
const { CreateOrderUseCase } = require('../../../src/usecases/CreateOrderUseCase');
const { InMemoryOrderRepository } = require('../../../src/infra/repositories/InMemoryOrderRepository');

// Estado compartilhado entre steps do cenário
let tipoBurguer;
let adicionais = [];
let observacao = '';
let resultado;
let erroCapturado;

// ── Givens ──────────────────────────────────────

Given('que o cliente escolheu o hambúrguer {string}', function (tipo) {
  tipoBurguer    = tipo;
  adicionais     = [];
  observacao     = '';
  resultado      = null;
  erroCapturado  = null;
});

Given('o cliente adicionou {string}', function (adicional) {
  adicionais.push(adicional);
});

Given('o cliente anotou a observação {string}', function (obs) {
  observacao = obs;
});

// ── When ─────────────────────────────────────────

When('o pedido for confirmado', async function () {
  const repo    = new InMemoryOrderRepository();
  const useCase = new CreateOrderUseCase(repo);

  try {
    resultado = await useCase.executar({ tipoBurguer, adicionais, observacao });
  } catch (erro) {
    erroCapturado = erro;
  }
});

// ── Thens ────────────────────────────────────────

Then('o pedido deve ser criado com sucesso', function () {
  assert.ok(resultado, 'Resultado não encontrado');
  assert.ok(resultado.id, 'Pedido sem ID');
});

Then('o status do pedido deve ser {string}', function (statusEsperado) {
  assert.strictEqual(resultado.status, statusEsperado);
});

Then('o total deve ser {float}', function (totalEsperado) {
  assert.strictEqual(resultado.total, totalEsperado);
});

Then('o pedido deve conter a observação {string}', function (obsEsperada) {
  assert.strictEqual(resultado.observacao, obsEsperada);
});

Then('o sistema deve retornar um erro de tipo inválido', function () {
  assert.ok(erroCapturado, 'Deveria ter lançado um erro');
  assert.ok(
    erroCapturado.message.includes('inválido'),
    `Mensagem inesperada: ${erroCapturado.message}`
  );
});
