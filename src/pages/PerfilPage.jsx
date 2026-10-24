import AcessoConta from '../components/AcessoConta.jsx';
import { perfis } from '../data/usuarios.js';
import { listarAtendimento } from '../services/operacionalService.js';
import PedidosPage from './PedidosPage.jsx';
import FilaCozinha from '../components/FilaCozinha.jsx';
import PainelGerente from '../components/PainelGerente.jsx';

export default function PerfilPage({ usuario, perfilDaRota, pedido, pedidos, onCarregarExemplos, onAtualizarPedido }) {
  const perfil = perfis.find(item => item.id === perfilDaRota);
  return <AcessoConta usuario={usuario}>{usuario && (usuario.perfil !== perfilDaRota ?
    <section className="painel"><h2>Explore outro perfil</h2><p>Esta tela demonstra o perfil {perfil.nome}. Selecione esse perfil na sua conta para conhecer a navegação.</p><a className="botao botao-primario" href="#/conta">Selecionar perfil na conta</a></section> :
    <section className="acesso-pagina" aria-labelledby="perfil-title"><p className="eyebrow">PERFIL DEMONSTRATIVO · {perfil.nome}</p><h2 id="perfil-title">{perfil.titulo}</h2><p>{perfil.descricao}</p>
      <div className="painel"><h3>{perfilDaRota === 'cliente' ? 'Sua próxima pausa começa aqui' : 'Pedido desta sessão'}</h3>
        <p>{pedido ? `Pedido ${pedido.id} · ${pedido.unidade.nome}` : 'Nenhum pedido registrado nesta sessão. Faça um checkout simulado para experimentar o acompanhamento.'}</p>
        <div className="checkout-acoes"><a className="botao botao-primario" href="#/cardapio">Ver cardápio</a>{perfilDaRota === 'cliente' && <a className="botao" href="#/carrinho">Meu carrinho</a>}{pedido && <a className="botao" href="#/pedido">Acompanhar pedido demonstrativo</a>}</div>
      </div>
      <a className="botao" href="#/pedidos">Consultar pedidos da sessão</a>
      {perfilDaRota !== 'cliente' && <p className="nota-secao">Área acadêmica com ações simuladas. A seleção de perfil não oferece autenticação ou autorização de produção.</p>}
      {perfilDaRota === 'atendente' && <PedidosPage pedidos={listarAtendimento(pedidos)} onCarregarExemplos={onCarregarExemplos} onAtualizarPedido={onAtualizarPedido} usuario={usuario} operacional titulo="Pedidos para atendimento" />}
      {perfilDaRota === 'cozinha' && <FilaCozinha pedidos={pedidos} onCarregarExemplos={onCarregarExemplos} onAtualizarPedido={onAtualizarPedido} usuario={usuario} />}
      {perfilDaRota === 'gerente' && <PainelGerente pedidos={pedidos} onCarregarExemplos={onCarregarExemplos} onAtualizarPedido={onAtualizarPedido} usuario={usuario} />}
      <a className="botao" href="#/conta">Voltar à minha conta</a>
    </section>)}</AcessoConta>;
}
