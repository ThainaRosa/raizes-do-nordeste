import { produtos } from '../data/produtos.js';
import { unidades } from '../data/unidades.js';

// Consultas síncronas aos mocks locais, sem requisições de rede.
// Retornamos cópias para preservar os objetos originais dos mocks.
export function listarUnidades() {
  return unidades.map(unidade => ({ ...unidade }));
}

export function listarProdutosPorUnidade(unidadeId) {
  return produtos
    .filter(produto => produto.unidadeId === unidadeId)
    .map(produto => ({ ...produto }));
}

export function filtrarProdutos(produtos, busca = '', categoria = 'Todos') {
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const termo = normalizar(busca.trim());
  return produtos.filter(produto =>
    normalizar(produto.nome).includes(termo) &&
    (categoria === 'Todos' || produto.categoria === categoria)
  );
}
