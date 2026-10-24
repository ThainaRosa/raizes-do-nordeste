export default function SeletorUnidade({ unidades, unidadeId, onChangeUnidade }) {
  return (
    <label className="unidade">
      Escolha a unidade
      <select value={unidadeId} onChange={event => onChangeUnidade(event.target.value)}>
        {unidades.map(unidade => (
          <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
        ))}
      </select>
    </label>
  );
}
