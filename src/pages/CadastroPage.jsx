import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import ErroFormulario from '../components/ErroFormulario.jsx';
import { CODIGO_DEMONSTRATIVO, perfis } from '../data/usuarios.js';

export default function CadastroPage({ usuario, onCadastrar }) {
  const [dados, setDados] = useState({ nome: '', email: '', perfil: '' });
  const [erro, setErro] = useState(null);
  const alterar = campo => event => setDados(atual => ({ ...atual, [campo]: event.target.value }));

  function enviar(event) {
    event.preventDefault();
    try {
      onCadastrar(dados);
      window.location.hash = '/conta';
    } catch (error) { setErro(error); }
  }

  if (usuario) return <section className="painel"><h2>Sua conta já está ativa</h2><p>Para cadastrar outra conta fictícia, saia da sessão atual.</p><a className="botao botao-primario" href="#/conta">Minha conta</a></section>;

  return (
    <section className="acesso-pagina" aria-labelledby="cadastro-title">
      <p className="eyebrow">FAÇA PARTE DESSA HISTÓRIA</p><h2 id="cadastro-title">Criar conta demonstrativa</h2>
      <p>Use somente nome e e-mail fictícios, como pessoa@exemplo.test. O cadastro dura até recarregar a página e permite entrar com o código público {CODIGO_DEMONSTRATIVO}.</p>
      <form className="painel formulario-acesso cadastro-formulario" noValidate onSubmit={enviar}>
        <ErroFormulario erro={erro} />
        <CampoFormulario rotulo="Nome fictício" type="text" name="nome" required maxLength={80} autoComplete="off" value={dados.nome} onChange={alterar('nome')} erro={erro?.campos?.nome} />
        <CampoFormulario rotulo="E-mail fictício" type="email" name="email" required maxLength={254} autoComplete="off" value={dados.email} onChange={alterar('email')} erro={erro?.campos?.email} />
        <CampoFormulario rotulo="Perfil de demonstração" name="perfil" required value={dados.perfil} onChange={alterar('perfil')} erro={erro?.campos?.perfil} ajuda="A seleção serve para explorar telas; não concede permissões reais.">
          <option value="">Selecione um perfil</option>{perfis.map(perfil => <option key={perfil.id} value={perfil.id}>{perfil.nome}</option>)}
        </CampoFormulario>
        <button className="botao botao-primario" type="submit">Criar conta fictícia</button>
        <p>Já tem uma conta? <a href="#/login">Entrar na demonstração</a></p>
        <p>Seu cadastro não exige consentimentos opcionais. <a href="#/privacidade">Consultar aviso de privacidade</a>.</p>
      </form>
    </section>
  );
}
