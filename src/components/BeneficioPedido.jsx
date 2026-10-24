import { preverPontos } from '../services/fidelidadeService.js';

export default function BeneficioPedido({ pedido, aprovado = false }) {
  const beneficio = pedido.beneficioAplicado;
  const pontos = preverPontos(pedido);
  if (!beneficio && !pedido.clienteId) return null;
  return <aside className="beneficio-pedido">
    {beneficio && <p>Benefício: <strong>{beneficio.descricao}</strong>{beneficio.tipo === 'recompensa' && ` · ${beneficio.pontos} pontos ${aprovado ? 'utilizados na aprovação' : 'reservados até a aprovação'}`}.</p>}
    {pedido.clienteId && <p>{pedido.status === 'retirado' ? `Pedido elegível a ${pontos} pontos, creditados uma única vez na conta que fez a compra.` : `${pontos} pontos previstos para a conta que fez a compra, creditados somente após a retirada.`}</p>}
  </aside>;
}
