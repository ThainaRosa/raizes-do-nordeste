import { formatarMoeda } from '../utils/formatarMoeda.js';

export default function ResumoCarrinho({ resumo }) {
  return (
    <dl className="resumo-carrinho" aria-label="Valores do pedido" aria-live="polite">
      <div><dt>Subtotal</dt><dd>{formatarMoeda(resumo.subtotalCentavos / 100)}</dd></div>
      <div><dt>Descontos</dt><dd>{formatarMoeda(resumo.descontoCentavos / 100)}</dd></div>
      <div className="resumo-total"><dt>Total</dt><dd>{formatarMoeda(resumo.totalCentavos / 100)}</dd></div>
    </dl>
  );
}
