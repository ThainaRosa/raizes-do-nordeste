import { useId } from 'react';
import Modal from './Modal.jsx';

export default function Confirmacao({ titulo, descricao, confirmar, onConfirmar, onCancelar }) {
  const id = useId();
  return (
    <Modal tituloId={id} onFechar={onCancelar} rotuloFechar="Cancelar alteração">
      <div className="detalhes-corpo">
        <h2 id={id}>{titulo}</h2><p>{descricao}</p>
        <div className="acoes-confirmacao">
          <button className="botao" type="button" onClick={onCancelar}>Cancelar</button>
          <button className="botao botao-primario" type="button" onClick={onConfirmar}>{confirmar}</button>
        </div>
      </div>
    </Modal>
  );
}
