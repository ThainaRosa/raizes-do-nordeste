import { listarUnidades, listarProdutosPorUnidade } from './cardapioService.js';
import { campanhas } from '../data/beneficios.js';
import { etapasPedido } from '../data/pedidos.js';
import { situacaoCampanha } from './beneficiosService.js';

const filtrarUnidade = (pedidos, unidadeId) => pedidos.filter(pedido => unidadeId === 'todas' || pedido.unidade.id === unidadeId);

export function listarFilaCozinha(pedidos, unidadeId = 'todas') {
  return filtrarUnidade(pedidos, unidadeId)
    .filter(pedido => ['recebido', 'preparando'].includes(pedido.status))
    .sort((a, b) => Date.parse(a.criadoEm) - Date.parse(b.criadoEm) || a.id.localeCompare(b.id));
}

export function listarAtendimento(pedidos) {
  return [...pedidos].sort((a, b) => Number(b.status === 'pronto') - Number(a.status === 'pronto') || Date.parse(a.criadoEm) - Date.parse(b.criadoEm));
}

export function resumirOperacao(pedidos, unidadeId = 'todas', agora = new Date()) {
  const selecionados = filtrarUnidade(pedidos, unidadeId);
  const unidades = listarUnidades().filter(unidade => unidadeId === 'todas' || unidade.id === unidadeId);
  const produtos = unidades.flatMap(unidade => listarProdutosPorUnidade(unidade.id).map(produto => ({ ...produto, unidadeNome: unidade.nome })));
  const resumoCampanhas = campanhas.map(campanha => ({ ...campanha, situacao: situacaoCampanha(campanha, agora) }));
  return {
    pedidos: selecionados, produtos, campanhas: resumoCampanhas,
    totalPedidos: selecionados.length,
    porStatus: Object.fromEntries(etapasPedido.map(etapa => [etapa.id, selecionados.filter(pedido => pedido.status === etapa.id).length])),
    totalAprovadoCentavos: selecionados.filter(pedido => pedido.pagamento.status === 'aprovado').reduce((total, pedido) => total + pedido.resumo.totalCentavos, 0),
    campanhasDisponiveis: resumoCampanhas.filter(campanha => campanha.situacao === 'Disponível' && (!campanha.unidadeId || unidadeId === 'todas' || campanha.unidadeId === unidadeId)).length,
  };
}
