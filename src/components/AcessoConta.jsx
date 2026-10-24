export default function AcessoConta({ usuario, children }) {
  if (usuario) return children;
  return <section className="painel"><h2>Entre para conhecer sua área</h2><p>Escolha uma conta fictícia para navegar pelas telas de cada perfil. O cardápio e o checkout também estão disponíveis sem login.</p><div className="checkout-acoes"><a className="botao botao-primario" href="#/login">Entrar na demonstração</a><a className="botao" href="#/cadastro">Criar conta fictícia</a><a className="botao" href="#/cardapio">Voltar ao cardápio</a></div></section>;
}
