import { useRef, useState } from 'react';
import { criarFidelidade, creditarPedidos, consumirRecompensa, consultarSaldo } from '../services/fidelidadeService.js';

export default function useFidelidade() {
  const registro = useRef(criarFidelidade());
  const [estado, setEstado] = useState(registro.current);
  function aplicar(transformar) {
    registro.current = transformar(registro.current);
    setEstado(registro.current);
  }
  return {
    estado, saldo: usuarioId => consultarSaldo(estado, usuarioId),
    consumir: pedido => aplicar(atual => consumirRecompensa(atual, pedido)),
    creditar: pedidos => aplicar(atual => creditarPedidos(atual, pedidos)),
    limpar: () => aplicar(() => criarFidelidade()),
  };
}
