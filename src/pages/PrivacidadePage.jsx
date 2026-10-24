import { useEffect, useState } from 'react';
import { finalidadesDados, opcoesPrivacidade } from '../data/privacidade.js';
import { preferenciasIniciais } from '../services/privacidadeService.js';

export default function PrivacidadePage({ preferencias, onSalvarPreferencias }) {
  const [rascunho, setRascunho] = useState(preferencias);
  const [mensagem, setMensagem] = useState('');
  useEffect(() => { setRascunho(preferencias); }, [preferencias]);

  function salvar(event) {
    event.preventDefault();
    onSalvarPreferencias(rascunho);
    setMensagem('Preferências salvas nesta sessão. As funções essenciais continuam disponíveis.');
  }

  function recusar() {
    const recusadas = preferenciasIniciais();
    onSalvarPreferencias(recusadas);
    setRascunho(recusadas);
    setMensagem('Todas as opções foram recusadas. Você pode continuar usando a aplicação normalmente.');
  }

  return <section className="privacidade-pagina" aria-labelledby="privacidade-title">
    <p className="eyebrow">ESCOLHAS CLARAS, SEM OBRIGAÇÃO</p><h2 id="privacidade-title">Privacidade e preferências</h2>
    <div className="painel"><h3>Sobre esta demonstração</h3><p>Raízes do Nordeste é um projeto acadêmico de Front-End com dados fictícios. Estas telas não representam segurança de produção nem comprovam conformidade integral com a LGPD.</p><p>Use somente nomes e e-mails inventados. Não solicitamos CPF, endereço, telefone, localização, senha real ou dados de cartão. Pagamentos são simulados.</p></div>
    <section className="painel" aria-labelledby="finalidades-title"><h3 id="finalidades-title">Quais dados aparecem e para quê?</h3>
      <dl className="finalidades-dados">{finalidadesDados.map(item => <div key={item.dados}><dt>{item.dados}</dt><dd><p>{item.finalidade}</p><p>{item.armazenamento}</p></dd></div>)}</dl>
      <p>O armazenamento do carrinho é separado das opções abaixo e serve à continuidade do pedido. Recusar as opções não impede cardápio, cadastro demonstrativo, checkout, acompanhamento ou fidelidade.</p>
    </section>
    <form className="painel preferencias-formulario" onSubmit={salvar}>
      <fieldset><legend>Consentimentos opcionais da demonstração</legend><p>As opções começam desmarcadas. Você pode salvar todas desmarcadas ou alterá-las quando quiser pelo rodapé ou pela sua conta.</p>
        {opcoesPrivacidade.map(opcao => <label className="preferencia-opcao" key={opcao.id}><input type="checkbox" checked={rascunho[opcao.id]} onChange={event => { setRascunho(atual => ({ ...atual, [opcao.id]: event.target.checked })); setMensagem(''); }} /><span><strong>{opcao.titulo}</strong><small>{opcao.descricao}</small><small>Escolha salva: {preferencias[opcao.id] ? 'aceita' : 'não aceita'}.</small></span></label>)}
      </fieldset>
      <div className="checkout-acoes"><button className="botao botao-primario" type="submit">Salvar preferências</button><button className="botao" type="button" onClick={recusar}>Recusar todas as opções</button></div>
      <p role="status">{mensagem}</p>
    </form>
    <section className="painel"><h3>Como alterar ou limpar os dados demonstrativos</h3><p>Volte a esta página para alterar ou revogar as preferências. Alterações não salvas no formulário não substituem a escolha anterior.</p><p>Recarregar remove a sessão, contas criadas, pedidos, movimentos de fidelidade e preferências em memória. O carrinho Mobile/Web pode ser removido pelos próprios controles do carrinho ou apagando os dados locais do site no navegador.</p><p>Ao encerrar o Totem, os dados do atendimento e as preferências são limpos. Não há envio de mensagens, rastreamento analítico ou compartilhamento de dados por estes controles.</p></section>
    <a className="botao botao-primario" href="#/cardapio">Continuar para o cardápio</a>
  </section>;
}
