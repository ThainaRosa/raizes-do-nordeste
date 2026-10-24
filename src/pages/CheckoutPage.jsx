import { useEffect, useRef, useState } from 'react';
import { listarUnidades } from '../services/cardapioService.js';
import { metodosPagamento, cenariosPagamento } from '../data/pagamento.js';
import ItensPedido from '../components/ItensPedido.jsx';
import ResumoCarrinho from '../components/ResumoCarrinho.jsx';
import BeneficioPedido from '../components/BeneficioPedido.jsx';

export default function CheckoutPage({ carrinho, resumo, unidadeId, checkoutPermitido, checkout, onConfirmarPedido, onRevisar, onPagar, erroBeneficio, beneficioAplicado }) {
  const [metodo, setMetodo] = useState('');
  const [cenario, setCenario] = useState('aprovado');
  const titulo = useRef(null);
  const processando = checkout.etapa === 'processando';
  const aprovado = checkout.etapa === 'aprovado';
  const revisando = checkout.etapa === 'revisao';
  const unidade = listarUnidades().find(item => item.id === unidadeId);
  const itens = checkout.confirmado?.itens || carrinho.map(item => ({ ...item, nome: item.produto.nome, precoCentavos: Math.round(item.produto.preco * 100) }));

  useEffect(() => { titulo.current?.focus(); }, [checkout.etapa]);

  if (aprovado) return (
    <section className="painel checkout-pagina">
      <p className="eyebrow">PAGAMENTO DEMONSTRATIVO</p>
      <h2 ref={titulo} tabIndex={-1}>Pagamento aprovado</h2>
      <p role="status">{checkout.resultado.mensagem}</p>
      <p className="pedido-identificador">{checkout.resultado.pedido.id}</p>
      <p>Estado inicial: <strong>Recebido</strong></p>
      <ResumoCarrinho resumo={checkout.resultado.pedido.resumo} />
      <BeneficioPedido pedido={checkout.resultado.pedido} aprovado />
      <a className="botao botao-primario" href={`#/pedido?numero=${encodeURIComponent(checkout.resultado.pedido.id)}`}>Acompanhar meu pedido</a>
    </section>
  );

  if (!checkoutPermitido && !processando) return (
    <section className="painel checkout-pagina"><h2 ref={titulo} tabIndex={-1}>Revise seu carrinho</h2><p role="alert">{erroBeneficio || 'Adicione produtos disponíveis antes de continuar para o pagamento.'}</p><a className="botao botao-primario" href="#/carrinho">Voltar ao carrinho</a></section>
  );

  return (
    <section className="checkout-pagina" aria-labelledby="checkout-title">
      <p className="eyebrow">CHECKOUT · SEM COBRANÇA REAL</p>
      <h2 id="checkout-title" ref={titulo} tabIndex={-1}>{processando ? 'Processando pagamento' : revisando ? 'Revise seu pedido' : 'Pagamento demonstrativo'}</h2>
      <ol className="checkout-passos" aria-label="Etapas do checkout"><li aria-current={revisando ? 'step' : undefined}>1. Revisão</li><li aria-current={!revisando ? 'step' : undefined}>2. Pagamento</li><li>3. Acompanhamento</li></ol>
      <div className="checkout-grid">
        <section className="painel" aria-label="Dados do pedido">
          <h3>{checkout.confirmado?.unidade.nome || unidade?.nome}</h3>
          <ItensPedido itens={itens} />
          <ResumoCarrinho resumo={checkout.confirmado?.resumo || resumo} />
          {!checkout.confirmado && beneficioAplicado && <p className="beneficio-pedido">Benefício selecionado: <strong>{beneficioAplicado.descricao}</strong>.</p>}
          {checkout.confirmado && <BeneficioPedido pedido={checkout.confirmado} />}
        </section>
        <section className="painel" aria-label="Confirmação e pagamento">
          {revisando ? <>
            <h3>Tudo certo com seu pedido?</h3>
            <p>Confira a unidade, os produtos, as quantidades e o total antes de confirmar.</p>
            {checkout.erro && <p role="alert" className="mensagem-erro">{checkout.erro}</p>}
            <div className="checkout-acoes"><button className="botao botao-primario" type="button" onClick={onConfirmarPedido}>Confirmar dados do pedido</button><a className="botao" href="#/carrinho">Editar carrinho</a></div>
          </> : <form aria-busy={processando} onSubmit={event => { event.preventDefault(); if (!processando && metodo) onPagar(metodo, cenario); }}>
            <fieldset disabled={processando}>
              <legend>Como deseja simular o pagamento?</legend>
              {metodosPagamento.map(item => <label key={item.id} className="pagamento-opcao"><input type="radio" name="metodo" value={item.id} required checked={metodo === item.id} onChange={() => setMetodo(item.id)} /><span><strong>{item.nome}</strong><small>{item.descricao}</small></span></label>)}
              <label className="cenario-pagamento">Resultado da simulação<select value={cenario} onChange={event => setCenario(event.target.value)}>{cenariosPagamento.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
            </fieldset>
            <div role="status" className="pagamento-feedback">{processando && <p><span className="carregando" aria-hidden="true" />Processando pagamento… Aguarde a resposta do serviço demonstrativo.</p>}{checkout.etapa === 'recusado' && <p>{checkout.resultado.mensagem}</p>}</div>
            {checkout.erro && <p className="mensagem-erro" role="alert">{checkout.erro} Seu carrinho foi mantido.</p>}
            <div className="checkout-acoes"><button className="botao botao-primario" type="submit" disabled={processando || !metodo}>{processando ? 'Processando pagamento…' : checkout.etapa === 'recusado' || checkout.etapa === 'falha' ? 'Tentar pagamento novamente' : 'Simular pagamento'}</button><button className="botao" type="button" disabled={processando} onClick={onRevisar}>Voltar à revisão</button></div>
          </form>}
        </section>
      </div>
    </section>
  );
}
