import ImagemProduto from './ImagemProduto.jsx';
import QuantidadeControle from './QuantidadeControle.jsx';
import { formatarMoeda } from '../utils/formatarMoeda.js';

export default function CarrinhoItem({ item, onQuantidade, onRemover }) {
  const { produto, quantidade, subtotalCentavos } = item;
  return (
    <li className="painel carrinho-item">
      <ImagemProduto src={produto.imagem} alt={produto.nome} />
      <div className="carrinho-item-conteudo">
        <h3>{produto.nome}</h3>
        <p>{formatarMoeda(produto.preco)} por unidade</p>
        {!produto.disponivel && <p className="mensagem-erro">Indisponível. Remova este produto para continuar.</p>}
        <QuantidadeControle nome={produto.nome} quantidade={quantidade} onChange={valor => onQuantidade(produto.id, valor)} disabled={!produto.disponivel} />
        <strong>Subtotal: {formatarMoeda(subtotalCentavos / 100)}</strong>
      </div>
      <button className="botao" type="button" onClick={() => onRemover(produto.id)} aria-label={`Remover ${produto.nome} do carrinho`}>Remover</button>
    </li>
  );
}
