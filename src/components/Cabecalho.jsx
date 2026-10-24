import { perfis } from '../data/usuarios.js';

export default function Cabecalho({ modo, onChangeModo, quantidadeCarrinho, onEncerrar, processando, temPedido, usuario, onSair }) {
  const perfil = perfis.find(item => item.id === usuario?.perfil);
  return (
    <header className="header">
      <a className="marca" href={processando ? undefined : '#/cardapio'} aria-disabled={processando} aria-label="Raízes do Nordeste — início">
        <span className="marca-simbolo" aria-hidden="true">RN<span>✳</span></span>
        <div>
          <span className="marca-legenda">DA NOSSA TERRA, PRA SUA MESA</span>
          <h1>Raízes <span>do Nordeste</span></h1>
        </div>
      </a>
      <nav aria-label="Navegação principal">
        <a className="menu-link" href={processando ? undefined : '#/cardapio'} aria-disabled={processando}>Nosso cardápio <span aria-hidden="true">↗</span></a>
        <a className="menu-link" href={processando ? undefined : '#/carrinho'} aria-disabled={processando}>Carrinho ({quantidadeCarrinho})</a>
        <a className="menu-link" href={processando ? undefined : '#/pedidos'} aria-disabled={processando}>Consultar pedidos</a>
        <a className="menu-link" href={processando ? undefined : '#/promocoes'} aria-disabled={processando}>Promoções</a>
        <a className="menu-link" href={processando ? undefined : '#/fidelidade'} aria-disabled={processando}>Fidelidade</a>
        {temPedido && <a className="menu-link" href={processando ? undefined : '#/pedido'} aria-disabled={processando}>Acompanhar pedido</a>}
      </nav>
      <label className="mode">
        Canal de atendimento
        <select value={modo} disabled={processando} onChange={event => onChangeModo(event.target.value)}>
          <option value="mobile">Mobile</option>
          <option value="web">Web</option>
          <option value="totem">Totem</option>
        </select>
      </label>
      {modo === 'totem' && <button className="botao encerrar-atendimento" type="button" disabled={processando} onClick={onEncerrar}>Encerrar atendimento</button>}
      <div className="identidade-usuario" aria-label="Sessão demonstrativa">
        {usuario ? <>
          <span className="usuario-identificacao">Olá, <strong>{usuario.nome}</strong> <span className="perfil-etiqueta">{perfil.nome}</span></span>
          <a className="menu-link" href={processando ? undefined : '#/conta'} aria-disabled={processando}>Minha conta</a>
          <a className="menu-link" href={processando ? undefined : `#${perfil.caminho}`} aria-disabled={processando}>{perfil.titulo}</a>
          <button className="botao" type="button" disabled={processando} onClick={onSair}>Sair da conta</button>
        </> : <><span>Atendimento sem login disponível</span><a className="menu-link" href={processando ? undefined : '#/login'} aria-disabled={processando}>Entrar</a><a className="menu-link" href={processando ? undefined : '#/cadastro'} aria-disabled={processando}>Cadastrar</a></>}
      </div>
    </header>
  );
}
