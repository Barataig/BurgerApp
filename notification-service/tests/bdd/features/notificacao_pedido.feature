# language: pt
Funcionalidade: Notificações de Pedido
  Como sistema de pedidos
  Quero notificar cliente e cozinha sobre o status do pedido
  Para que todos sejam informados em tempo real

  Cenário: Notificar confirmação do pedido
    Dado que o pedido "pedido-001" foi criado com hambúrguer "Duplo"
    Quando o evento "PEDIDO_CONFIRMADO" for disparado
    Então devem ser geradas 2 notificações
    E uma notificação deve ser para o "cliente"
    E uma notificação deve ser para a "cozinha"

  Cenário: Notificar início do preparo
    Dado que o pedido "pedido-002" foi criado com hambúrguer "Clássico"
    Quando o evento "PREPARO_INICIADO" for disparado
    Então devem ser geradas 2 notificações

  Cenário: Notificar pedido pronto
    Dado que o pedido "pedido-003" foi criado com hambúrguer "Vegano"
    Quando o evento "PEDIDO_PRONTO" for disparado
    Então devem ser geradas 2 notificações
    E uma notificação deve conter a mensagem "PRONTO"

  Cenário: Rejeitar evento inválido
    Dado que o pedido "pedido-004" foi criado com hambúrguer "Frango Crispy"
    Quando o evento "EVENTO_INVALIDO" for disparado
    Então o sistema deve retornar erro de evento inválido
