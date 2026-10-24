import { useId, useState } from 'react';
import { etapasPedido, modelosPedidos } from '../data/pedidos.js';
import { formatarMoeda } from '../utils/formatarMoeda.js';
import AcoesPedido from '../components/AcoesPedido.jsx';
import { listarUnidades } from '../services/cardapioService.js';

export default function PedidosPage({ pedidos, registroCompleto = pedidos, onCarregarExemplos, usuario, onAtualizarPedido, operacional = false, mostrarFiltroUnidade = true, titulo = 'Consultar pedidos' }) {
  const tituloId = useId();
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('todos');
  const [unidade, setUnidade] = useState('todas');
  const filtrados = pedidos.filter(pedido => pedido.id.toUpperCase().includes(busca.trim().toUpperCase()) && (status === 'todos' || pedido.status === status) && (!operacional || unidade === 'todas' || pedido.unidade.id === unidade));
  const exemplosCarregados = modelosPedidos.every(modelo => registroCompleto.some(pedido => pedido.id === modelo.id));

  return <section className="consulta-pedidos" aria-labelledby={tituloId}>
    <p className="eyebrow">{operacional ? 'PAINEL OPERACIONAL SIMULADO' : 'DO PREPARO À RETIRADA'}</p><h2 id={tituloId}>{titulo}</h2>
    <p>Consulte os pedidos gerados pelo checkout nesta sessão ou carregue exemplos para experimentar os quatro status.</p>
    <button className="botao" type="button" disabled={exemplosCarregados} onClick={onCarregarExemplos}>{exemplosCarregados ? 'Exemplos já carregados' : 'Carregar pedidos de exemplo'}</button>
    <form className="filtros-pedidos" onSubmit={event => { event.preventDefault(); if (busca.trim()) window.location.hash = `/pedido?numero=${encodeURIComponent(busca.trim())}`; }}>
      <label>Número demonstrativo do pedido<input type="search" value={busca} onChange={event => setBusca(event.target.value)} placeholder="Ex.: RN-DEMO-1001" /></label>
      <label>Filtrar por status<select value={status} onChange={event => setStatus(event.target.value)}><option value="todos">Todos os status</option>{etapasPedido.map(etapa => <option key={etapa.id} value={etapa.id}>{etapa.nome}</option>)}</select></label>
      {operacional && mostrarFiltroUnidade && <label>Filtrar pedidos por unidade<select value={unidade} onChange={event => setUnidade(event.target.value)}><option value="todas">Todas as unidades</option>{listarUnidades().map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>}
      <button className="botao botao-primario" type="submit" disabled={!busca.trim()}>Consultar número exato</button>
    </form>
    <p role="status">{filtrados.length} {filtrados.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}</p>
    {filtrados.length === 0 ? <div className="painel"><h3>{pedidos.length ? 'Nenhum pedido corresponde aos filtros' : 'Nenhum pedido registrado'}</h3><p>{pedidos.length ? 'Tente outro número ou status.' : 'Monte seu carrinho e conclua o checkout simulado, ou carregue exemplos acima.'}</p>{pedidos.length > 0 && <button className="botao" type="button" onClick={() => { setBusca(''); setStatus('todos'); setUnidade('todas'); }}>Limpar filtros</button>}<a className="botao" href="#/cardapio">Ir ao cardápio</a></div> :
      <ul className="lista-consulta-pedidos">{filtrados.map(pedido => <li className="painel" key={pedido.id}>
        <h3 className="pedido-identificador">{pedido.id}</h3><p>{pedido.unidade.nome}</p><p><span className="perfil-etiqueta">{etapasPedido.find(etapa => etapa.id === pedido.status)?.nome || 'Status não reconhecido'}</span>{pedido.exemplo && <span> · Exemplo</span>}</p><p>{pedido.itens.reduce((total, item) => total + item.quantidade, 0)} itens · <strong>{formatarMoeda(pedido.resumo.totalCentavos / 100)}</strong></p>
        {operacional && <ul className="itens-preparo">{pedido.itens.map(item => <li key={item.produtoId}>{item.quantidade} × {item.nome}</li>)}</ul>}
        <a className="botao botao-primario" href={`#/pedido?numero=${encodeURIComponent(pedido.id)}`}>Ver pedido {pedido.id}</a>
        {operacional && <AcoesPedido key={`${pedido.id}-${usuario?.perfil}`} pedido={pedido} usuario={usuario} onAtualizarPedido={onAtualizarPedido} />}
      </li>)}</ul>}
  </section>;
}
