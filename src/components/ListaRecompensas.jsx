import { useState } from 'react';
import { recompensas } from '../data/beneficios.js';

export default function ListaRecompensas({ onRecompensa, beneficio }) {
  const [erro, setErro] = useState('');
  function usar(id) {
    try {
      onRecompensa(id);
      setErro('');
      window.location.hash = '/carrinho';
    } catch (error) { setErro(error.message); }
  }
  return <section aria-label="Recompensas disponíveis"><h3>Escolha sua recompensa</h3>
    <div className="grid-beneficios">{recompensas.map(item => <article className="painel" key={item.id}>
      <h4>{item.nome}</h4><p><strong>{item.pontos} pontos</strong></p><p>Desconto limitado ao subtotal, sem troco. O custo em pontos é fixo.</p>
      <button className="botao botao-primario" type="button" disabled={!!beneficio} onClick={() => usar(item.id)}>Usar recompensa {item.nome}</button>
    </article>)}</div>
    {beneficio && <p>Já há um benefício selecionado. Remova-o no carrinho para escolher outro.</p>}
    {erro && <p role="alert" className="mensagem-erro">{erro}</p>}
  </section>;
}
