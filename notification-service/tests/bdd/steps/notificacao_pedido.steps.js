const { Given, When, Then } = require('@cucumber/cucumber');
const assert                = require('assert');
const { NotifyUseCase }     = require('../../../src/usecases/NotificationUseCases');
const { InMemoryNotificationRepository } = require('../../../src/infra/repositories/InMemoryNotificationRepository');

let pedidoId, hamburguer, evento;
let resultado, erroCapturado;

Given('que o pedido {string} foi criado com hambúrguer {string}', function (id, burger) {
  pedidoId      = id;
  hamburguer    = burger;
  resultado     = null;
  erroCapturado = null;
});

When('o evento {string} for disparado', async function (ev) {
  evento = ev;
  const repo    = new InMemoryNotificationRepository();
  const useCase = new NotifyUseCase(repo);

  try {
    resultado = await useCase.executar({
      pedidoId,
      evento,
      hamburguer,
      adicionais: [],
      observacao: '',
      pagamento:  { metodo: 'PIX' },
    });
  } catch (erro) {
    erroCapturado = erro;
  }
});

Then('devem ser geradas {int} notificações', function (quantidade) {
  assert.ok(resultado, 'Resultado não encontrado');
  assert.strictEqual(resultado.length, quantidade);
});

Then('uma notificação deve ser para o {string}', function (destinatario) {
  const encontrada = resultado.find(n => n.destinatario === destinatario);
  assert.ok(encontrada, `Notificação para "${destinatario}" não encontrada`);
});

Then('uma notificação deve ser para a {string}', function (destinatario) {
  const encontrada = resultado.find(n => n.destinatario === destinatario);
  assert.ok(encontrada, `Notificação para "${destinatario}" não encontrada`);
});

Then('uma notificação deve conter a mensagem {string}', function (texto) {
  const encontrada = resultado.find(n => n.mensagem.includes(texto));
  assert.ok(encontrada, `Nenhuma notificação contém "${texto}"`);
});

Then('o sistema deve retornar erro de evento inválido', function () {
  assert.ok(erroCapturado, 'Deveria ter lançado um erro');
  assert.ok(erroCapturado.message.includes('inválido'));
});
