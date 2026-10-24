import { recompensas, saldosIniciais } from '../data/beneficios.js';

export const criarFidelidade = () => ({ saldos: { ...saldosIniciais }, creditos: {}, resgates: {} });
export const consultarSaldo = (estado, usuarioId) => estado.saldos[usuarioId] || 0;

export function pontosElegiveis(pedido) {
  if (!pedido.clienteId || pedido.exemplo || pedido.status !== 'retirado' || pedido.pagamento?.status !== 'aprovado') return 0;
  return preverPontos(pedido);
}

export function preverPontos(pedido) {
  if (!pedido.clienteId || pedido.exemplo || !Number.isSafeInteger(pedido.resumo?.totalCentavos)) return 0;
  return Math.floor(Math.max(0, pedido.resumo.totalCentavos) / 100);
}

export function creditarPedidos(estado, pedidos) {
  let atual = estado;
  for (const pedido of pedidos) {
    const pontos = pontosElegiveis(pedido);
    if (!pontos || atual.creditos[pedido.id]) continue;
    atual = {
      ...atual, saldos: { ...atual.saldos, [pedido.clienteId]: consultarSaldo(atual, pedido.clienteId) + pontos },
      creditos: { ...atual.creditos, [pedido.id]: { usuarioId: pedido.clienteId, pontos } },
    };
  }
  return atual;
}

export function consumirRecompensa(estado, pedido) {
  const beneficio = pedido.beneficioAplicado;
  if (beneficio?.tipo !== 'recompensa' || estado.resgates[pedido.id]) return estado;
  if (pedido.pagamento?.status !== 'aprovado' || beneficio.usuarioId !== pedido.clienteId) throw new Error('Resgate inválido para este pedido.');
  const saldo = consultarSaldo(estado, beneficio.usuarioId);
  const recompensa = recompensas.find(item => item.id === beneficio.id);
  if (!recompensa || recompensa.pontos !== beneficio.pontos) throw new Error('Dados da recompensa inconsistentes.');
  if (!Number.isSafeInteger(beneficio.pontos) || beneficio.pontos <= 0 || saldo < beneficio.pontos) throw new Error('Saldo insuficiente para concluir o resgate.');
  return {
    ...estado, saldos: { ...estado.saldos, [beneficio.usuarioId]: saldo - beneficio.pontos },
    resgates: { ...estado.resgates, [pedido.id]: { usuarioId: beneficio.usuarioId, pontos: beneficio.pontos } },
  };
}
