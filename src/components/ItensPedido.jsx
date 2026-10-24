import { formatarMoeda } from '../utils/formatarMoeda.js';

export default function ItensPedido({ itens }) {
  return <ul className="itens-pedido">{itens.map(item => (
    <li key={item.produtoId}>
      <div><strong>{item.quantidade} × {item.nome}</strong><span>{formatarMoeda(item.precoCentavos / 100)} por unidade</span></div>
      <strong>{formatarMoeda(item.subtotalCentavos / 100)}</strong>
    </li>
  ))}</ul>;
}
