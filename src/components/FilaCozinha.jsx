import { useState } from 'react';
import { listarFilaCozinha } from '../services/operacionalService.js';
import { etapasPedido } from '../data/pedidos.js';
import SeletorUnidadeOperacional from './SeletorUnidadeOperacional.jsx';
import AcoesPedido from './AcoesPedido.jsx';

export default function FilaCozinha({ pedidos, usuario, onAtualizarPedido, onCarregarExemplos }) {
  const [unidadeId, setUnidadeId] = useState('todas');
  const fila = listarFilaCozinha(pedidos, unidadeId);
  return <section className="fila-cozinha" aria-labelledby="fila-title"><h2 id="fila-title">Fila de preparo</h2><p>Pedidos recebidos e em preparo, do mais antigo ao mais recente. Pedidos prontos seguem para a retirada no atendimento.</p>
    <SeletorUnidadeOperacional value={unidadeId} onChange={setUnidadeId} />
    <p role="status">{fila.length} {fila.length === 1 ? 'pedido na fila' : 'pedidos na fila'}</p>
    {fila.length === 0 ? <div className="painel"><h3>Fila vazia nesta seleção</h3><p>Não há pedidos aguardando preparo nesta unidade.</p>{pedidos.length === 0 && <button className="botao" type="button" onClick={onCarregarExemplos}>Carregar pedidos de exemplo</button>}</div> :
      <ol className="lista-consulta-pedidos fila-lista">{fila.map(pedido => <li className="painel" key={pedido.id}><h3 className="pedido-identificador">{pedido.id}</h3><p>{pedido.unidade.nome}</p><span className="perfil-etiqueta">{etapasPedido.find(etapa => etapa.id === pedido.status).nome}</span>
        <p>Recebido em <time dateTime={pedido.criadoEm}>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(pedido.criadoEm))}</time></p>
        <ul className="itens-preparo">{pedido.itens.map(item => <li key={item.produtoId}><strong>{item.quantidade} ×</strong> {item.nome}</li>)}</ul>
        <AcoesPedido pedido={pedido} usuario={usuario} onAtualizarPedido={onAtualizarPedido} />
        <a className="botao" href={`#/pedido?numero=${encodeURIComponent(pedido.id)}`}>Ver detalhes do pedido</a>
      </li>)}</ol>}
  </section>;
}
