import { useId, useState } from 'react';
import Modal from './Modal.jsx';
import ImagemProduto from './ImagemProduto.jsx';
import { formatarMoeda } from '../utils/formatarMoeda.js';
import { quantidadeValida, QUANTIDADE_MAXIMA } from '../services/carrinhoService.js';

export default function ProdutoDetalhes({ produto, onFechar, onAdicionar }) {
  const tituloId = useId();
  const quantidadeId = useId();
  const erroId = useId();
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState('');
  const valida = quantidadeValida(quantidade);

  function adicionar(event) {
    event.preventDefault();
    try {
      onAdicionar(produto.id, quantidade);
      onFechar();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <Modal tituloId={tituloId} onFechar={onFechar}>
      <ImagemProduto src={produto.imagem} alt={produto.nome} />
      <div className="detalhes-corpo">
        <span className="eyebrow">{produto.categoria}</span>
        <h2 id={tituloId}>{produto.nome}</h2>
        <p>{produto.descricao}</p>
        <strong>{formatarMoeda(produto.preco)} por unidade</strong>
        <p className="detalhes-status">{produto.disponivel ? 'Disponível nesta unidade' : 'Produto indisponível nesta unidade'}</p>
        <form onSubmit={adicionar}>
          <label htmlFor={quantidadeId}>Quantidade (1 a {QUANTIDADE_MAXIMA})</label>
          <div className="quantidade-controle">
            <button className="botao" type="button" aria-label="Diminuir quantidade" disabled={!produto.disponivel || !valida || quantidade <= 1} onClick={() => { setQuantidade(q => q - 1); setErro(''); }}>−</button>
            <input id={quantidadeId} type="number" inputMode="numeric" min="1" max={QUANTIDADE_MAXIMA} step="1" required value={quantidade} disabled={!produto.disponivel} aria-invalid={!valida} aria-describedby={erro ? erroId : undefined} onChange={event => { setQuantidade(event.target.value === '' ? '' : Number(event.target.value)); setErro(''); }} />
            <button className="botao" type="button" aria-label="Aumentar quantidade" disabled={!produto.disponivel || !valida || quantidade >= QUANTIDADE_MAXIMA} onClick={() => { setQuantidade(q => q + 1); setErro(''); }}>+</button>
          </div>
          <p>Subtotal: <strong>{formatarMoeda(valida ? Math.round(produto.preco * 100) * quantidade / 100 : 0)}</strong></p>
          {!valida && <p role="status">Informe uma quantidade inteira entre 1 e {QUANTIDADE_MAXIMA}.</p>}
          {erro && <p id={erroId} role="alert" className="mensagem-erro">{erro}</p>}
          <button className="botao botao-primario" type="submit" disabled={!produto.disponivel || !valida}>{produto.disponivel ? 'Adicionar ao carrinho' : 'Produto indisponível'}</button>
        </form>
      </div>
    </Modal>
  );
}
