import { etapasPedido } from '../data/pedidos.js';

export default function EvolucaoPedido({ pedido }) {
  const indice = etapasPedido.findIndex(etapa => etapa.id === pedido.status);
  return <ol className="evolucao-pedido" aria-label="Evolução do pedido">{etapasPedido.map((etapa, i) => {
    const registro = pedido.historico.find(item => item.status === etapa.id);
    return <li key={etapa.id} className={i <= indice ? 'etapa-ativa' : ''} aria-current={i === indice ? 'step' : undefined}>
      <span className="etapa-numero" aria-hidden="true">{i < indice ? '✓' : i + 1}</span>
      <div><strong>{etapa.nome}</strong><span>{i < indice ? 'Concluída' : i === indice ? 'Etapa atual' : 'Aguardando'}</span>{registro && <time dateTime={registro.em}>{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(registro.em))}</time>}</div>
    </li>;
  })}</ol>;
}
