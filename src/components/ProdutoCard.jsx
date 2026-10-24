import { formatarMoeda } from '../utils/formatarMoeda.js';
import ImagemProduto from './ImagemProduto.jsx';

export default function ProdutoCard({ produto, onSelecionar }) {
  return (
    <article className="painel produto">
      <ImagemProduto src={produto.imagem} alt={produto.nome} />
      <div className="produto-corpo">
        <span className="eyebrow">{produto.categoria}</span>
        <h3>{produto.nome}</h3>
        <p className="produto-descricao">{produto.descricao}</p>
        <div className="produto-base">
          <strong>{formatarMoeda(produto.preco)}</strong>
          <span className={`status ${produto.disponivel ? '' : 'status-indisponivel'}`}>
            {produto.disponivel ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        <button className="botao produto-detalhes" type="button" onClick={() => onSelecionar(produto.id)} aria-label={`Ver detalhes de ${produto.nome}`}>Ver detalhes</button>
      </div>
    </article>
  );
}
