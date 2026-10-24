import { useEffect, useState } from 'react';
import ProdutoCard from '../components/ProdutoCard.jsx';
import ImagemProduto from '../components/ImagemProduto.jsx';
import SeletorUnidade from '../components/SeletorUnidade.jsx';
import ProdutoDetalhes from '../components/ProdutoDetalhes.jsx';
import { filtrarProdutos, listarProdutosPorUnidade, listarUnidades } from '../services/cardapioService.js';
import '../styles/cardapio.css';

function Catalogo({ produtos, onSelecionar }) {
  const [categoria, setCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');
  const categorias = ['Todos', ...new Set(produtos.map(produto => produto.categoria))];
  const filtrados = filtrarProdutos(produtos, busca, categoria);

  return (
    <>
      <label className="busca-produtos">Buscar pelo nome
        <input type="search" value={busca} onChange={event => setBusca(event.target.value)} placeholder="Ex.: tapioca, cuscuz, cajá…" />
      </label>
      <div className="categorias" role="group" aria-label="Filtrar por categoria">
        {categorias.map(item => (
          <button key={item} type="button" className="categoria" aria-pressed={categoria === item} onClick={() => setCategoria(item)}>{item}</button>
        ))}
      </div>
      <p className="contagem" role="status">{filtrados.length} {filtrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
      <div className="grid-produtos">
        {filtrados.map(produto => <ProdutoCard key={produto.id} produto={produto} onSelecionar={onSelecionar} />)}
      </div>
      {filtrados.length === 0 && <div className="painel vazio-busca"><h3>Nenhum produto encontrado</h3><p>Tente outro nome ou escolha uma categoria diferente.</p><button className="botao" type="button" onClick={() => { setBusca(''); setCategoria('Todos'); }}>Limpar filtros</button></div>}
    </>
  );
}

export default function CardapioPage({ unidadeId, onChangeUnidade, onAdicionar }) {
  const [selecao, setSelecao] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const unidades = listarUnidades();
  const catalogo = listarProdutosPorUnidade(unidadeId);
  const destaques = catalogo.filter(produto => produto.destaque);
  const principal = destaques[0] || catalogo[0];
  const unidade = unidades.find(item => item.id === unidadeId);
  const selecionado = selecao?.unidadeId === unidadeId
    ? catalogo.find(produto => produto.id === selecao.id)
    : null;

  useEffect(() => {
    setSelecao(null);
    setMensagem('');
  }, [unidadeId]);

  function selecionarProduto(id) {
    setMensagem('');
    setSelecao({ id, unidadeId });
  }

  function adicionarProduto(id, quantidade) {
    onAdicionar(id, quantidade);
    const produto = catalogo.find(item => item.id === id);
    setMensagem(`${quantidade} × ${produto.nome} adicionado ao carrinho.`);
  }

  function verCardapio() {
    const titulo = document.getElementById('cardapio-title');
    titulo?.scrollIntoView({ block: 'start' });
    titulo?.focus({ preventScroll: true });
  }

  return (
    <>
      <section className="intro" aria-labelledby="inicio-title">
        <div className="intro-conteudo">
          <p className="eyebrow">SABOR QUE CONTA HISTÓRIA</p>
          <h2 id="inicio-title">Um pedacinho do <em>Nordeste</em> em cada sabor.</h2>
          <p className="intro-texto">Da tapioca ao baião de dois, uma pausa com gosto de casa. Conheça os sabores da nossa terra e encontre o seu favorito.</p>
          <button className="botao botao-primario" type="button" onClick={verCardapio}>Explorar o cardápio <span aria-hidden="true">↗</span></button>
          <span className="intro-assinatura">Tradição na receita. Carinho em cada detalhe.</span>
        </div>
        {principal && <div className="intro-visual">
          <ImagemProduto src={principal.imagem} alt={principal.nome} prioridade />
          <div className="intro-selo"><span aria-hidden="true">✳</span> Da nossa terra <strong>{principal.nome}</strong></div>
        </div>}
      </section>

      <section className="painel unidade-painel" aria-label="Local de atendimento">
        <div><span className="eyebrow">PERTO DE VOCÊ</span><h2>O sabor começa por aqui.</h2><p>Selecione uma unidade para conhecer o cardápio disponível.</p></div>
        <SeletorUnidade unidades={unidades} unidadeId={unidadeId} onChangeUnidade={onChangeUnidade} />
      </section>

      {destaques.length > 0 && <section aria-labelledby="destaques-title" className="destaques">
        <div className="secao-titulo"><div><p className="eyebrow">OS QUERIDINHOS DA CASA</p><h2 id="destaques-title">Sabores em destaque</h2></div><span className="nota-secao">Seleção da casa · {unidade?.nome}</span></div>
        <div className="grid-produtos grid-destaques">{destaques.map(produto => <ProdutoCard key={produto.id} produto={produto} onSelecionar={selecionarProduto} />)}</div>
      </section>}

      <section aria-labelledby="cardapio-title" className="cardapio-secao">
        <div className="secao-titulo"><div><p className="eyebrow">ESCOLHA O SEU FAVORITO</p><h2 id="cardapio-title" tabIndex={-1}>Nosso cardápio</h2></div><span className="nota-secao">Feito para sua pausa</span></div>
        {catalogo.length > 0 ? <Catalogo key={unidadeId} produtos={catalogo} onSelecionar={selecionarProduto} /> : <p role="status" className="painel">Nenhum produto cadastrado para esta unidade.</p>}
      </section>

      <div className="feedback-carrinho" role="status">{mensagem && <span>{mensagem} <a href="#/carrinho">Ver carrinho</a></span>}</div>
      {selecionado && <ProdutoDetalhes key={selecionado.id} produto={selecionado} onFechar={() => setSelecao(null)} onAdicionar={adicionarProduto} />}

      <aside className="faixa-tradicao"><span aria-hidden="true">✳</span><p>Raízes que acolhem.<br /><strong>Sabores que aproximam.</strong></p><span>O Nordeste é a nossa inspiração.</span></aside>
    </>
  );
}
