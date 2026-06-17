# language: pt
Funcionalidade: Criação de Pedidos
  Como funcionário da lanchonete
  Quero registrar pedidos de hambúrguer
  Para que a cozinha possa prepará-los corretamente

  Cenário: Criar pedido simples com hambúrguer clássico
    Dado que o cliente escolheu o hambúrguer "classico"
    Quando o pedido for confirmado
    Então o pedido deve ser criado com sucesso
    E o status do pedido deve ser "pendente"
    E o total deve ser 18.00

  Cenário: Criar pedido com adicionais
    Dado que o cliente escolheu o hambúrguer "duplo"
    E o cliente adicionou "bacon"
    E o cliente adicionou "batata"
    Quando o pedido for confirmado
    Então o pedido deve ser criado com sucesso
    E o total deve ser 40.00

  Cenário: Criar pedido com observação
    Dado que o cliente escolheu o hambúrguer "classico"
    E o cliente anotou a observação "sem cebola"
    Quando o pedido for confirmado
    Então o pedido deve conter a observação "sem cebola"

  Cenário: Rejeitar pedido com tipo inválido
    Dado que o cliente escolheu o hambúrguer "sanduiche"
    Quando o pedido for confirmado
    Então o sistema deve retornar um erro de tipo inválido
