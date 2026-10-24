import { useEffect, useRef, useState } from 'react';
import { confirmarDadosPedido, simularPagamento } from '../services/pagamentoService.js';

const inicial = () => ({ etapa: 'revisao', confirmado: null, resultado: null, erro: '' });

export default function useCheckout({ itens, unidadeId, modo, beneficio, usuario, saldoPontos, onAprovado }) {
  const [checkout, setCheckout] = useState(inicial);
  const emEnvio = useRef(false);
  const controle = useRef(null);

  useEffect(() => () => controle.current?.abort(), []);

  function resetar() {
    if (!emEnvio.current) setCheckout(inicial());
  }

  function confirmar() {
    if (emEnvio.current) return;
    try {
      const confirmado = confirmarDadosPedido({ itens, unidadeId, modo, beneficio, usuario, saldoPontos });
      setCheckout({ etapa: 'pagamento', confirmado, resultado: null, erro: '' });
    } catch (error) {
      setCheckout({ ...inicial(), erro: error.message });
    }
  }

  async function enviar(metodo, cenario) {
    // O ref bloqueia inclusive dois eventos no mesmo ciclo, antes do próximo render.
    if (emEnvio.current || !checkout.confirmado || checkout.etapa === 'aprovado') return;
    emEnvio.current = true;
    const controller = new AbortController();
    controle.current = controller;
    try {
      const atual = confirmarDadosPedido({ itens, unidadeId, modo, beneficio, usuario, saldoPontos });
      if (JSON.stringify(atual) !== JSON.stringify(checkout.confirmado)) throw new Error('O pedido foi alterado. Volte à revisão e confirme os dados novamente.');
      setCheckout(anterior => ({ ...anterior, etapa: 'processando', erro: '', resultado: null }));
      const resultado = await simularPagamento({ pedidoConfirmado: checkout.confirmado, metodo, cenario, signal: controller.signal });
      if (resultado.status === 'aprovado') onAprovado(resultado.pedido);
      setCheckout(anterior => ({ ...anterior, etapa: resultado.status, resultado, erro: '' }));
      window.location.hash = '/checkout';
    } catch (error) {
      if (controller.signal.aborted) return;
      setCheckout(anterior => ({ ...anterior, etapa: 'falha', resultado: null, erro: error.message }));
      window.location.hash = '/checkout';
    } finally {
      emEnvio.current = false;
      controle.current = null;
    }
  }

  return { checkout, confirmar, enviar, resetar, ocupado: () => emEnvio.current };
}
