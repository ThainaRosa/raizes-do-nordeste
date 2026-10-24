import { useState } from 'react';
import { campanhas } from '../data/beneficios.js';
import { situacaoCampanha } from '../services/beneficiosService.js';
import BeneficiosCarrinho from '../components/BeneficiosCarrinho.jsx';

export default function PromocoesPage(props) {
  const [erro, setErro] = useState('');
  function aplicar(codigo) {
    try { props.onCupom(codigo); setErro(''); window.location.hash = '/carrinho'; }
    catch (error) { setErro(error.message); }
  }
  return <section className="beneficios-pagina" aria-labelledby="promocoes-title">
    <p className="eyebrow">CAMPANHAS FICTÍCIAS</p><h2 id="promocoes-title">Mais sabor, mais vantagens</h2><p>Escolha um benefício para seu pedido. Todas as campanhas são demonstrativas.</p>
    <BeneficiosCarrinho {...props} />
    {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
    <div className="grid-beneficios">{campanhas.map(item => <article className="painel" key={item.codigo}>
      <span className="perfil-etiqueta">{situacaoCampanha(item)}</span><h3>{item.nome}</h3><p>{item.descricao}</p><p>Validade: {new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(new Date(item.fim))}.</p><code>{item.codigo}</code>
      <button className="botao" type="button" onClick={() => aplicar(item.codigo)}>Aplicar {item.codigo}</button>
    </article>)}</div>
  </section>;
}
