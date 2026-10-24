import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import ErroFormulario from '../components/ErroFormulario.jsx';
import { CODIGO_DEMONSTRATIVO, perfis, usuariosDemonstrativos } from '../data/usuarios.js';

export default function LoginPage({ usuario, onEntrar, modo }) {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState(null);

  function enviar(event) {
    event.preventDefault();
    try {
      onEntrar({ email, codigo });
      setCodigo('');
      window.location.hash = '/conta';
    } catch (error) { setErro(error); }
  }

  if (usuario) return <section className="painel"><h2>Você já está na demonstração</h2><p>Olá, {usuario.nome}.</p><a className="botao botao-primario" href="#/conta">Ir para minha conta</a></section>;

  return (
    <section className="acesso-pagina" aria-labelledby="login-title">
      <div><p className="eyebrow">BEM-VINDO À NOSSA CASA</p><h2 id="login-title">Entre na demonstração</h2><p>Use uma conta fictícia e o código público <strong>{CODIGO_DEMONSTRATIVO}</strong>. Não informe senha ou dados reais.</p></div>
      <div className="acesso-grid">
        <form className="painel formulario-acesso" noValidate onSubmit={enviar}>
          <ErroFormulario erro={erro} />
          <CampoFormulario rotulo="E-mail fictício" type="email" name="email" required autoComplete="off" value={email} onChange={event => setEmail(event.target.value)} erro={erro?.campos?.email} />
          <CampoFormulario rotulo="Código demonstrativo" type="text" name="codigo" required autoComplete="off" spellCheck={false} value={codigo} onChange={event => setCodigo(event.target.value)} erro={erro?.campos?.codigo} ajuda={`Código público para todas as contas: ${CODIGO_DEMONSTRATIVO}`} />
          <button className="botao botao-primario" type="submit">Entrar na demonstração</button>
          <p>Primeira visita? <a href="#/cadastro">Criar conta fictícia</a></p>
          <p>Consulte o <a href="#/privacidade">aviso de privacidade</a>. As escolhas opcionais não são necessárias para entrar.</p>
          <a href="#/cardapio">{modo === 'totem' ? 'Continuar atendimento sem login' : 'Explorar o cardápio sem login'}</a>
        </form>
        <aside className="painel contas-demo" aria-label="Contas fictícias disponíveis">
          <h3>Escolha um perfil para experimentar</h3>
          <p>Preencha os campos com uma das contas prontas e depois selecione “Entrar na demonstração”.</p>
          {usuariosDemonstrativos.map(item => <button className="botao conta-demo" type="button" key={item.id} onClick={() => { setEmail(item.email); setCodigo(CODIGO_DEMONSTRATIVO); setErro(null); }}><strong>Preencher {perfis.find(perfil => perfil.id === item.perfil).nome}</strong><span>{item.email}</span></button>)}
        </aside>
      </div>
    </section>
  );
}
