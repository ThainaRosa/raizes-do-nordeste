import { useEffect, useId, useState } from 'react';
import { quantidadeValida, QUANTIDADE_MAXIMA } from '../services/carrinhoService.js';

export default function QuantidadeControle({ quantidade, onChange, nome, disabled = false }) {
  const id = useId();
  const [rascunho, setRascunho] = useState(String(quantidade));
  const [erro, setErro] = useState('');
  const valorDigitado = Number(rascunho);
  const base = quantidadeValida(valorDigitado) ? valorDigitado : quantidade;

  useEffect(() => { setRascunho(String(quantidade)); }, [quantidade]);

  function aplicar(valor) {
    try {
      onChange(valor);
      setRascunho(String(valor));
      setErro('');
    } catch (error) {
      setErro(error.message);
      setRascunho(String(quantidade));
    }
  }

  function confirmar() {
    const valor = Number(rascunho);
    if (!quantidadeValida(valor)) {
      setErro(`Use uma quantidade inteira de 1 a ${QUANTIDADE_MAXIMA}.`);
      setRascunho(String(quantidade));
    } else if (valor !== quantidade) aplicar(valor);
  }

  return (
    <div className="quantidade-campo">
      <label htmlFor={id}>Quantidade de {nome}</label>
      <div className="quantidade-controle" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) confirmar(); }}>
        <button className="botao" type="button" aria-label={`Diminuir quantidade de ${nome}`} disabled={disabled || base <= 1} onClick={() => aplicar(base - 1)}>−</button>
        <input id={id} type="number" min="1" max={QUANTIDADE_MAXIMA} step="1" inputMode="numeric" value={rascunho} disabled={disabled} aria-invalid={!!erro} aria-describedby={erro ? `${id}-erro` : undefined}
          onChange={event => { setRascunho(event.target.value); setErro(''); }}
          onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); confirmar(); } }} />
        <button className="botao" type="button" aria-label={`Aumentar quantidade de ${nome}`} disabled={disabled || base >= QUANTIDADE_MAXIMA} onClick={() => aplicar(base + 1)}>+</button>
      </div>
      {erro && <p id={`${id}-erro`} className="mensagem-erro" role="alert">{erro}</p>}
    </div>
  );
}
