import { listarUnidades } from '../services/cardapioService.js';
import SeletorUnidade from '../components/SeletorUnidade.jsx';
import CarrinhoItem from '../components/CarrinhoItem.jsx';
import ResumoCarrinho from '../components/ResumoCarrinho.jsx';
import BeneficiosCarrinho from '../components/BeneficiosCarrinho.jsx';

export default function CarrinhoPage(props) {
  const { unidadeId, onChangeUnidade, carrinho, resumo, checkoutPermitido, onRemover, onQuantidade, erroBeneficio } = props;
  const unidades = listarUnidades();
  const unidade = unidades.find(item => item.id === unidadeId);

  return (
    <section className="carrinho-pagina" aria-labelledby="carrinho-title">
      <div className="secao-titulo"><h2 id="carrinho-title">Seu carrinho</h2><a className="botao" href="#/cardapio">Continuar escolhendo</a></div>
      <SeletorUnidade unidades={unidades} unidadeId={unidadeId} onChangeUnidade={onChangeUnidade} />
      <p>Seu pedido pertence à {unidade?.nome}. Trocar de unidade esvazia o carrinho após sua confirmação.</p>
      {carrinho.length === 0 ? <div className="painel vazio-busca" role="status"><h3>Seu carrinho está vazio</h3><p>Escolha um sabor do nosso cardápio para começar.</p><a className="botao botao-primario" href="#/cardapio">Explorar o cardápio</a></div> : (
        <ul className="carrinho-lista">{carrinho.map(item => <CarrinhoItem key={item.produtoId} item={item} onQuantidade={onQuantidade} onRemover={onRemover} />)}</ul>
      )}
      <BeneficiosCarrinho {...props} />
      <div className="painel resumo-painel">
        <h3>Resumo do pedido</h3>
        <ResumoCarrinho resumo={resumo} />
        {!props.beneficio && <p className="nota-secao">Nenhum benefício aplicado.</p>}
        <button type="button" className="botao botao-primario" disabled={!checkoutPermitido} onClick={() => { if (checkoutPermitido) window.location.hash = '/checkout'; }}>Continuar para conferência</button>
        {!checkoutPermitido && carrinho.length > 0 && <p className="mensagem-erro" role="status">{erroBeneficio || 'Remova os produtos indisponíveis antes de continuar.'}</p>}
      </div>

    </section>
  );
}
