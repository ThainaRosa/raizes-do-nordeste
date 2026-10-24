import { acoesStatusPedido, etapasPedido, modelosPedidos } from '../data/pedidos.js';
import { confirmarDadosPedido } from './pagamentoService.js';

export function consultarPedido(pedidos, numero) {
  const id = String(numero || '').trim().toUpperCase();
  return pedidos.find(pedido => pedido.id.toUpperCase() === id) || null;
}

export function registrarPedido(pedidos, pedido) {
  if (consultarPedido(pedidos, pedido.id)) return pedidos;
  if (!pedido.id || pedido.status !== 'recebido' || pedido.pagamento?.status !== 'aprovado') {
    throw new Error('Somente pedidos recebidos com pagamento simulado aprovado podem ser registrados.');
  }
  return [...pedidos, {
    ...structuredClone(pedido),
    historico: [{ status: 'recebido', em: pedido.criadoEm, perfil: 'sistema' }],
  }];
}

export function atualizarStatusPedido(pedidos, id, statusEsperado, destino, perfil) {
  const pedido = consultarPedido(pedidos, id);
  if (!pedido) throw new Error('Pedido não encontrado. Consulte novamente o número demonstrativo.');
  if (pedido.status !== statusEsperado) throw new Error('O status já foi atualizado. Confira a etapa atual antes de tentar novamente.');
  const acao = acoesStatusPedido.find(item => item.de === pedido.status && item.para === destino);
  if (!acao) throw new Error('Transição inválida. O pedido só pode avançar uma etapa e não pode voltar.');
  if (!acao.perfis.includes(perfil)) throw new Error('Selecione um perfil operacional compatível para demonstrar esta ação.');
  return pedidos.map(item => item.id === pedido.id ? {
    ...item, status: destino,
    historico: [...item.historico, { status: destino, em: new Date().toISOString(), perfil }],
  } : item);
}

export function carregarPedidosExemplo(pedidos) {
  const exemplos = modelosPedidos.filter(modelo => !consultarPedido(pedidos, modelo.id)).map((modelo, indice) => {
    const criadoEm = new Date(Date.now() - (30 + indice * 5) * 60000).toISOString();
    const etapaAtual = etapasPedido.findIndex(etapa => etapa.id === modelo.status);
    return {
      ...confirmarDadosPedido({ ...modelo, modo: 'web' }),
      id: modelo.id, criadoEm, status: modelo.status, exemplo: true,
      pagamento: { status: 'aprovado', metodo: 'pix-demo', simulado: true },
      historico: etapasPedido.slice(0, etapaAtual + 1).map((etapa, indiceEtapa) => ({
        status: etapa.id, em: new Date(Date.parse(criadoEm) + indiceEtapa * 60000).toISOString(), perfil: 'exemplo',
      })),
    };
  });
  return [...pedidos, ...exemplos];
}
