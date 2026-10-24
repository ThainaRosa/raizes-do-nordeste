import { useId } from 'react';

export default function CampoFormulario({ rotulo, erro, ajuda, children, ...props }) {
  const id = useId();
  const descricao = [ajuda && `${id}-ajuda`, erro && `${id}-erro`].filter(Boolean).join(' ') || undefined;
  const comuns = { ...props, id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': descricao };
  return (
    <div className="campo-formulario">
      <label htmlFor={id}>{rotulo}{props.required && <span> (obrigatório)</span>}</label>
      {children ? <select {...comuns}>{children}</select> : <input {...comuns} />}
      {ajuda && <small id={`${id}-ajuda`}>{ajuda}</small>}
      {erro && <p id={`${id}-erro`} className="mensagem-erro">{erro}</p>}
    </div>
  );
}
