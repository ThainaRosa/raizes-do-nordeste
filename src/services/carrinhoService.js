import { listarProdutosPorUnidade } from './cardapioService.js';

export const QUANTIDADE_MAXIMA = 99;

export function quantidadeValida(quantidade) {
  return Number.isInteger(quantidade) && quantidade >= 1 && quantidade <= QUANTIDADE_MAXIMA;
}

// O carrinho guarda apenas referências e quantidades. Os mocks são a fonte dos produtos.
export function adicionarItem(itens, unidadeId, produtoId, quantidade) {
  const produto = listarProdutosPorUnidade(unidadeId).find(item => item.id === produtoId);
  if (!produto || !produto.disponivel) throw new Error('Este produto não está disponível nesta unidade.');
  const existente = itens.find(item => item.produtoId === produtoId);
  const total = (existente?.quantidade || 0) + quantidade;
  if (!quantidadeValida(quantidade) || !quantidadeValida(total)) {
    throw new Error(`Escolha entre 1 e ${QUANTIDADE_MAXIMA} unidades por produto, incluindo as que já estão no carrinho.`);
  }
  return existente
    ? itens.map(item => item.produtoId === produtoId ? { ...item, quantidade: total } : item)
    : [...itens, { produtoId, quantidade }];
}

export function detalharCarrinho(itens, unidadeId) {
  const produtos = listarProdutosPorUnidade(unidadeId);
  return itens.flatMap(item => {
    const produto = produtos.find(produto => produto.id === item.produtoId);
    return produto ? [{ ...item, produto, subtotalCentavos: Math.round(produto.preco * 100) * item.quantidade }] : [];
  });
}

export function alterarQuantidade(itens, unidadeId, produtoId, quantidade) {
  if (!quantidadeValida(quantidade)) throw new Error(`Informe uma quantidade inteira entre 1 e ${QUANTIDADE_MAXIMA}.`);
  const atual = itens.find(item => item.produtoId === produtoId);
  if (!atual) throw new Error('Produto não encontrado no carrinho.');
  const produto = listarProdutosPorUnidade(unidadeId).find(item => item.id === produtoId);
  if (!produto || !produto.disponivel) throw new Error('Remova o produto indisponível para continuar.');
  return itens.map(item => item.produtoId === produtoId ? { ...item, quantidade } : item);
}

export function calcularResumo(carrinho, descontoSolicitado = 0) {
  const subtotalCentavos = carrinho.reduce((total, item) =>
    total + (Number.isSafeInteger(item.subtotalCentavos) ? Math.max(0, item.subtotalCentavos) : 0), 0);
  const descontoCentavos = Number.isSafeInteger(descontoSolicitado)
    ? Math.min(subtotalCentavos, Math.max(0, descontoSolicitado)) : 0;
  return { subtotalCentavos, descontoCentavos, totalCentavos: Math.max(0, subtotalCentavos - descontoCentavos) };
}

export function podeFinalizar(itens, unidadeId) {
  const detalhados = detalharCarrinho(itens, unidadeId);
  return itens.length > 0 && detalhados.length === itens.length && detalhados.every(item =>
    item.produto.disponivel && quantidadeValida(item.quantidade)
  );
}
