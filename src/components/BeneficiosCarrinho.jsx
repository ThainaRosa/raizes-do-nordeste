import { useState } from 'react';
import { regraBeneficios } from '../data/beneficios.js';
import { formatarMoeda } from '../utils/formatarMoeda.js';

export default function BeneficiosCarrinho({ beneficio, beneficioAplicado, erroBeneficio, saldoPontos, usuario, onCupom, onRemoverBeneficio }) {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');

  function aplicar(event) {
    event.preventDefault();
    try {
      onCupom(codigo);
      setErro('');
      setCodigo('');
    } catch (error) { setErro(error.message); }
  }

  return <section className="painel beneficios-carrinho" aria-label="Benefícios do pedido">
    <h3>Um benefício para sua pausa</h3><p>{regraBeneficios}</p>
    {beneficio ? <>
      {beneficioAplicado && <p role="status"><strong>{beneficioAplicado.descricao}</strong> · desconto de {formatarMoeda(beneficioAplicado.descontoCentavos / 100)}{beneficioAplicado.tipo === 'recompensa' && ` · ${beneficioAplicado.pontos} pontos reservados`}</p>}
      {erroBeneficio && <p role="alert" className="mensagem-erro">{erroBeneficio} Remova o benefício ou ajuste o carrinho antes do checkout.</p>}
      <button className="botao" type="button" onClick={() => { onRemoverBeneficio(); setErro(''); }}>Remover benefício</button>
    </> : <form className="cupom-formulario" onSubmit={aplicar}>
      <label>Código do cupom<input type="text" value={codigo} onChange={event => { setCodigo(event.target.value); setErro(''); }} autoComplete="off" placeholder="Ex.: SABOR10" /></label>
      <button className="botao botao-primario" type="submit" disabled={!codigo.trim()}>Aplicar cupom</button>
    </form>}
    {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
    <div className="checkout-acoes"><a className="botao" href="#/promocoes">Ver campanhas e regras</a><a className="botao" href="#/fidelidade">{usuario?.perfil === 'cliente' ? `Usar meus ${saldoPontos} pontos` : 'Conhecer a fidelidade'}</a></div>
  </section>;
}
