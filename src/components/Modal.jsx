import { useEffect, useRef } from 'react';

export default function Modal({ tituloId, onFechar, children, rotuloFechar = 'Fechar detalhes do produto' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const origem = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflowAnterior;
      origem?.focus();
    };
  }, []);

  function manterFoco(event) {
    if (event.key !== 'Tab') return;
    const controles = [...ref.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]')]
      .filter(elemento => elemento.tabIndex >= 0 && elemento.getClientRects().length > 0);
    const primeiro = controles[0];
    const ultimo = controles[controles.length - 1];
    if ((event.shiftKey && document.activeElement === primeiro) || (!event.shiftKey && document.activeElement === ultimo)) {
      event.preventDefault();
      (event.shiftKey ? ultimo : primeiro)?.focus();
    }
  }

  return (
    <dialog ref={ref} className="modal" aria-labelledby={tituloId} onKeyDown={manterFoco} onCancel={event => { event.preventDefault(); onFechar(); }}>
      <button type="button" className="botao modal-fechar" autoFocus onClick={onFechar} aria-label={rotuloFechar}>Fechar ×</button>
      {children}
    </dialog>
  );
}
