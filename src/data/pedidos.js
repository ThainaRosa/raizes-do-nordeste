export const etapasPedido = [
  { id: 'recebido', nome: 'Recebido', descricao: 'Pagamento simulado aprovado. A unidade recebeu seu pedido.' },
  { id: 'preparando', nome: 'Em preparo', descricao: 'A cozinha está preparando os sabores do seu pedido.' },
  { id: 'pronto', nome: 'Pronto para retirada', descricao: 'Seu pedido está pronto. Apresente o número demonstrativo no balcão da unidade indicada.' },
  { id: 'retirado', nome: 'Retirado', descricao: 'Retirada confirmada. Obrigado pela visita!' },
];

export const acoesStatusPedido = [
  { de: 'recebido', para: 'preparando', rotulo: 'Iniciar preparo', perfis: ['cozinha', 'gerente'] },
  { de: 'preparando', para: 'pronto', rotulo: 'Marcar como pronto', perfis: ['cozinha', 'gerente'] },
  { de: 'pronto', para: 'retirado', rotulo: 'Confirmar retirada', perfis: ['atendente', 'gerente'] },
];

// Referências aos mocks existentes. Nomes e preços são resolvidos pelo serviço.
export const modelosPedidos = [
  { id: 'RN-DEMO-1001', unidadeId: 'centro', itens: [{ produtoId: 1, quantidade: 1 }], status: 'recebido' },
  { id: 'RN-DEMO-1002', unidadeId: 'centro', itens: [{ produtoId: 2, quantidade: 2 }], status: 'preparando' },
  { id: 'RN-DEMO-1003', unidadeId: 'shopping', itens: [{ produtoId: 4, quantidade: 1 }], status: 'pronto' },
  { id: 'RN-DEMO-1004', unidadeId: 'centro', itens: [{ produtoId: 3, quantidade: 1 }], status: 'retirado' },
];
