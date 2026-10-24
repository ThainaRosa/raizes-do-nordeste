import { listarUnidades } from '../services/cardapioService.js';

export default function SeletorUnidadeOperacional({ value, onChange }) {
  return <label className="unidade unidade-operacional">Unidade do painel<select value={value} onChange={event => onChange(event.target.value)}><option value="todas">Todas as unidades</option>{listarUnidades().map(unidade => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}</select></label>;
}
