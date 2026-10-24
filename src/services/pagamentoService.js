import { listarUnidades } from './cardapioService.js';
import { detalharCarrinho, podeFinalizar } from './carrinhoService.js';
import { calcularBeneficios } from './beneficiosService.js';
import { cenariosPagamento, metodosPagamento } from '../data/pagamento.js';

export function confirmarDadosPedido({ itens, unidadeId, modo, beneficio = null, usuario = null, saldoPontos = 0 }) {
  const unidade = listarUnidades().find(item => item.id === unidadeId && item.ativa);
  if (!unidade || !podeFinalizar(itens, unidadeId)) throw new Error('Revise o carrinho: o pedido está vazio ou contém produtos inválidos ou indisponíveis.');
  if (!['mobile', 'web', 'totem'].includes(modo)) throw new Error('Canal de atendimento inválido.');
  const carrinho = detalharCarrinho(itens, unidadeId);
  const calculo = calcularBeneficios({ carrinho, unidadeId, beneficio, usuario, saldoPontos });
  if (calculo.erro) throw new Error(calculo.erro);
  return {
    unidade: { id: unidade.id, nome: unidade.nome },
    canal: modo,
    itens: carrinho.map(item => ({
      produtoId: item.produtoId, nome: item.produto.nome, quantidade: item.quantidade,
      precoCentavos: Math.round(item.produto.preco * 100), subtotalCentavos: item.subtotalCentavos,
    })),
    resumo: calculo.resumo,
    beneficioAplicado: calculo.aplicado,
    clienteId: usuario?.perfil === 'cliente' ? usuario.id : null,
  };
}

function aguardarServico(tempoMs, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Simulação cancelada.', 'AbortError'));
    const cancelar = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancelar);
      reject(new DOMException('Simulação cancelada.', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', cancelar);
      resolve();
    }, tempoMs);
    signal?.addEventListener('abort', cancelar, { once: true });
  });
}

// Adaptador de um provedor fictício: somente latência local, sem fetch ou cobranças.
export async function simularPagamento({ pedidoConfirmado, metodo, cenario, signal, tempoMs = 1500 }) {
  if (!metodosPagamento.some(item => item.id === metodo)) throw new Error('Selecione um método demonstrativo válido.');
  if (!cenariosPagamento.some(item => item.id === cenario)) throw new Error('Selecione um cenário de simulação válido.');
  if (!pedidoConfirmado?.itens?.length || !Number.isSafeInteger(pedidoConfirmado.resumo?.totalCentavos) || pedidoConfirmado.resumo.totalCentavos < 0) {
    throw new Error('Confirme os dados de um pedido válido antes de pagar.');
  }
  // Fotografia independente: alterações posteriores não mudam a transação em curso.
  const dados = structuredClone(pedidoConfirmado);
  await aguardarServico(tempoMs, signal);
  if (cenario === 'falha') throw new Error('O serviço demonstrativo está indisponível. Nenhuma cobrança foi realizada. Tente novamente.');
  if (cenario === 'recusado') return { status: 'recusado', mensagem: 'Pagamento demonstrativo recusado. Seu carrinho foi mantido. Escolha outro método ou tente novamente.' };
  return {
    status: 'aprovado',
    mensagem: 'Pagamento simulado aprovado! Seu pedido foi recebido.',
    pedido: {
      ...dados,
      id: `RN-DEMO-${crypto.randomUUID().toUpperCase()}`,
      criadoEm: new Date().toISOString(),
      status: 'recebido',
      pagamento: { status: 'aprovado', metodo, simulado: true },
    },
  };
}
