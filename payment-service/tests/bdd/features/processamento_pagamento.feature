# language: pt
Funcionalidade: Processamento de Pagamentos
  Como sistema de pedidos
  Quero processar pagamentos com diferentes métodos
  Para que o pedido seja confirmado corretamente

  Cenário: Processar pagamento via PIX
    Dado que o pedido "pedido-001" tem total de 48.00
    Quando o pagamento for processado via "pix"
    Então o pagamento deve ser aprovado
    E o método registrado deve ser "PIX"

  Cenário: Processar pagamento em dinheiro com troco
    Dado que o pedido "pedido-002" tem total de 22.00
    Quando o pagamento for processado via "dinheiro" com valor entregue de 30.00
    Então o pagamento deve ser aprovado
    E o detalhe deve conter "Troco"

  Cenário: Processar pagamento no crédito parcelado
    Dado que o pedido "pedido-003" tem total de 30.00
    Quando o pagamento for processado via "credito" em 3 parcelas
    Então o pagamento deve ser aprovado
    E o detalhe deve conter "3x"

  Cenário: Rejeitar método de pagamento inválido
    Dado que o pedido "pedido-004" tem total de 20.00
    Quando o pagamento for processado via "boleto"
    Então o sistema deve retornar erro de método inválido
