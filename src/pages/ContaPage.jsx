import AcessoConta from '../components/AcessoConta.jsx';
import CampoFormulario from '../components/CampoFormulario.jsx';
import { perfis } from '../data/usuarios.js';

export default function ContaPage({ usuario, onSair, onPerfil, modo }) {
  const perfil = perfis.find(item => item.id === usuario?.perfil);
  return <AcessoConta usuario={usuario}>{usuario && <section className="acesso-pagina" aria-labelledby="conta-title">
    <p className="eyebrow">SUA CONTA DEMONSTRATIVA</p><h2 id="conta-title">Olá, {usuario.nome}.</h2>
    <div className="painel conta-resumo"><span className="perfil-etiqueta">{perfil.nome}</span><p className="conta-email">{usuario.email}</p><p>Sessão em memória: ao recarregar a página, você precisará entrar novamente.</p>
      {modo === 'totem' && <p>Ao encerrar este atendimento, a sessão e os cadastros criados na demonstração serão limpos.</p>}
      <CampoFormulario rotulo="Perfil para explorar" value={usuario.perfil} onChange={event => onPerfil(event.target.value)} ajuda="Os perfis alteram somente a navegação demonstrativa. Não há autorização ou segurança de produção.">{perfis.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</CampoFormulario>
      <div className="checkout-acoes"><a className="botao botao-primario" href={`#${perfil.caminho}`}>Abrir {perfil.titulo.toLowerCase()}</a><button className="botao" type="button" onClick={onSair}>Sair da conta</button></div>
      <a className="botao" href="#/fidelidade">Meus pontos e recompensas</a>
      <a className="botao" href="#/privacidade">Consultar e alterar preferências de privacidade</a>
    </div>
  </section>}</AcessoConta>;
}
