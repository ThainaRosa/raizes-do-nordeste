import { useState } from 'react';
import { acoesStatusPedido, etapasPedido } from '../data/pedidos.js';

export default function AcoesPedido({ pedido, usuario, onAtualizarPedido }) {
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const acao = acoesStatusPedido.find(item => item.de === pedido.status);
  const disponivel = acao?.perfis.includes(usuario?.perfil);

  function atualizar() {
    try {
      onAtualizarPedido(pedido.id, pedido.status, acao.para);
      setMensagem(`Status atualizado para ${etapasPedido.find(etapa => etapa.id === acao.para).nome}.`);
      setErro('');
    } catch (error) { setErro(error.message); setMensagem(''); }
  }

  return <div className="acoes-pedido">
    {pedido.status === 'retirado' ? <p>Retirada concluída. Não há novas etapas para este pedido.</p> : disponivel ? <><p>Ação simulada do perfil operacional selecionado.</p><button className="botao botao-primario" type="button" onClick={atualizar}>{acao.rotulo}</button></> : <p>As atualizações são demonstradas pelos perfis Cozinha, Atendente e Gerente/Administrador. <a href="#/conta">Explorar perfis na conta</a></p>}
    <p role="status">{mensagem}</p>{erro && <p role="alert" className="mensagem-erro">{erro}</p>}
  </div>;
}
