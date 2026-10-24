import { useRef, useState } from 'react';
import { atualizarStatusPedido, carregarPedidosExemplo, consultarPedido, registrarPedido } from '../services/pedidoService.js';

export default function usePedidos() {
  const registro = useRef([]);
  const [pedidos, setPedidos] = useState([]);
  const [selecionadoId, setSelecionadoId] = useState(null);

  function aplicar(transformar) {
    // Atualização síncrona do registro também impede cliques repetidos com status antigo.
    registro.current = transformar(registro.current);
    setPedidos(registro.current);
    return registro.current;
  }

  function registrar(pedido) {
    aplicar(atuais => registrarPedido(atuais, pedido));
    setSelecionadoId(pedido.id);
  }

  function carregarExemplos() {
    aplicar(carregarPedidosExemplo);
  }

  function limpar() {
    aplicar(() => []);
    setSelecionadoId(null);
  }

  return {
    pedidos, pedido: consultarPedido(pedidos, selecionadoId), registrar, carregarExemplos, limpar,
    atualizar: (id, esperado, destino, perfil) => aplicar(atuais => atualizarStatusPedido(atuais, id, esperado, destino, perfil)),
  };
}
