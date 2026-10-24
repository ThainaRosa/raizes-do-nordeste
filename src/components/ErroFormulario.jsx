import { useEffect, useRef } from 'react';

export default function ErroFormulario({ erro }) {
  const ref = useRef(null);
  useEffect(() => { if (erro) ref.current?.focus(); }, [erro]);
  return erro ? <p className="formulario-erro mensagem-erro" ref={ref} tabIndex={-1} role="alert">{erro.message}</p> : null;
}
