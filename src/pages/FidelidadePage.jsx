import AcessoConta from '../components/AcessoConta.jsx';
import ListaRecompensas from '../components/ListaRecompensas.jsx';
import { regraFidelidade, regraBeneficios, saldosIniciais } from '../data/beneficios.js';

export default function FidelidadePage({ usuario, saldoPontos, fidelidadeEstado, beneficio, onRecompensa }) {
  return <AcessoConta usuario={usuario}>{usuario && <section className="beneficios-pagina" aria-labelledby="fidelidade-title">
    <p className="eyebrow">FIDELIDADE DEMONSTRATIVA</p><h2 id="fidelidade-title">Cada visita cria raízes</h2>
    <div className="painel"><p>Saldo fictício de {usuario.nome}</p><p className="saldo-pontos" role="status">{saldoPontos} pontos</p><p>{regraFidelidade}</p><p>{regraBeneficios}</p>
      <p>Esta conta começa com {saldosIniciais[usuario.id] || 0} pontos fictícios. Saldos e movimentos ficam apenas nesta sessão.</p>
    </div>
    {usuario.perfil === 'cliente' ? <ListaRecompensas beneficio={beneficio} onRecompensa={onRecompensa} /> : <p>Selecione o perfil Cliente na <a href="#/conta">sua conta</a> para reservar recompensas e pontuar em novos pedidos.</p>}
    <section className="painel"><h3>Movimentos da conta</h3>
      <ul>{Object.entries(fidelidadeEstado.creditos).filter(([, item]) => item.usuarioId === usuario.id).map(([id, item]) => <li key={`credito-${id}`}>+{item.pontos} pontos · pedido {id} retirado</li>)}
        {Object.entries(fidelidadeEstado.resgates).filter(([, item]) => item.usuarioId === usuario.id).map(([id, item]) => <li key={`resgate-${id}`}>−{item.pontos} pontos · recompensa no pedido {id}</li>)}
      </ul>
      {!Object.values(fidelidadeEstado.creditos).some(item => item.usuarioId === usuario.id) && !Object.values(fidelidadeEstado.resgates).some(item => item.usuarioId === usuario.id) && <p>Nenhum crédito ou resgate nesta sessão.</p>}
    </section><a className="botao botao-primario" href="#/carrinho">Voltar ao carrinho</a>
  </section>}</AcessoConta>;
}
