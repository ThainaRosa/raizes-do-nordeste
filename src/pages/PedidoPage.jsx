import { etapasPedido } from '../data/pedidos.js';
import { metodosPagamento } from '../data/pagamento.js';
import { consultarPedido } from '../services/pedidoService.js';
import ItensPedido from '../components/ItensPedido.jsx';
import ResumoCarrinho from '../components/ResumoCarrinho.jsx';
import EvolucaoPedido from '../components/EvolucaoPedido.jsx';
import AcoesPedido from '../components/AcoesPedido.jsx';
import BeneficioPedido from '../components/BeneficioPedido.jsx';

export default function PedidoPage({ pedido: pedidoAtual, pedidos, numeroPedido, usuario, onAtualizarPedido }) {
  const pedido = numeroPedido !== null ? consultarPedido(pedidos, numeroPedido) : pedidoAtual;
  if (!pedido) return <section className="painel">
    <h2>{numeroPedido !== null ? 'Pedido não encontrado' : pedidos.length ? 'Selecione um pedido para acompanhar' : 'Nenhum pedido para acompanhar'}</h2>
    <p>{numeroPedido !== null ? `Não encontramos o número “${numeroPedido}” nesta sessão. Confira o número ou consulte os pedidos disponíveis.` : 'Faça um checkout simulado ou carregue pedidos de exemplo na consulta.'}</p>
    <div className="checkout-acoes"><a className="botao botao-primario" href="#/pedidos">Consultar pedidos</a><a className="botao" href="#/cardapio">Ir ao cardápio</a></div>
  </section>;
  const etapa = etapasPedido.find(item => item.id === pedido.status);
  return (
    <section className="pedido-pagina" aria-labelledby="pedido-title">
      <p className="eyebrow">ACOMPANHAMENTO DEMONSTRATIVO</p><h2 id="pedido-title">Acompanhe seu pedido</h2>
      <p className="pedido-identificador">{pedido.id}</p><p>{pedido.unidade.nome} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(pedido.criadoEm))}</p>
      <div className="painel"><p role="status"><strong>{etapa?.nome || 'Status não reconhecido'}</strong> — {etapa?.descricao}</p>
        <EvolucaoPedido pedido={pedido} />
        {pedido.status === 'pronto' && <aside className="orientacao-retirada"><h3>Pode vir buscar!</h3><p>Dirija-se ao balcão da {pedido.unidade.nome} e apresente o número <strong>{pedido.id}</strong>. Aguarde a confirmação da entrega pela equipe.</p></aside>}
        <AcoesPedido key={`${pedido.id}-${usuario?.perfil || 'visitante'}`} pedido={pedido} usuario={usuario} onAtualizarPedido={onAtualizarPedido} />
      </div>
      <div className="painel"><h3>Resumo do pedido</h3><p>Pagamento simulado aprovado · {metodosPagamento.find(item => item.id === pedido.pagamento.metodo)?.nome}</p><ItensPedido itens={pedido.itens} /><ResumoCarrinho resumo={pedido.resumo} /><BeneficioPedido pedido={pedido} aprovado /></div>
      <p>Pedidos fictícios compartilhados nesta sessão. As ações por perfil são apenas demonstrativas.</p><div className="checkout-acoes"><a className="botao botao-primario" href="#/pedidos">Consultar outros pedidos</a><a className="botao" href="#/cardapio">Voltar ao cardápio</a></div>
    </section>
  );
}
