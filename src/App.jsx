import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import Navegacao from './routes/Navegacao.jsx';
import Confirmacao from './components/Confirmacao.jsx';
import useCheckout from './hooks/useCheckout.js';
import useAuth from './hooks/useAuth.js';
import usePedidos from './hooks/usePedidos.js';
import useFidelidade from './hooks/useFidelidade.js';
import usePrivacidade from './hooks/usePrivacidade.js';
import { calcularBeneficios, selecionarBeneficio } from './services/beneficiosService.js';
import { listarUnidades } from './services/cardapioService.js';
import { adicionarItem, alterarQuantidade, detalharCarrinho, podeFinalizar } from './services/carrinhoService.js';
import { estadoInicial, restaurarCarrinho, persistirCarrinho } from './services/persistenciaCarrinho.js';
import './styles/compra.css';
import './styles/auth.css';
import './styles/pedidos.css';
import './styles/beneficios.css';
import './styles/operacional-privacidade.css';

function carregarEstado() {
  try { return restaurarCarrinho(window.localStorage); }
  catch { return estadoInicial(); }
}

export default function App() {
  const [estado, setEstado] = useState(carregarEstado);
  const [pendente, setPendente] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [semPersistencia, setSemPersistencia] = useState(false);
  const acompanhamento = usePedidos();
  const { pedido, pedidos } = acompanhamento;
  const auth = useAuth();
  const privacidade = usePrivacidade();
  const fidelidade = useFidelidade();
  const [beneficio, setBeneficio] = useState(null);
  const saldoPontos = fidelidade.saldo(auth.usuario?.id);
  const { modo, unidadeId, itens, sessao } = estado;
  const carrinho = detalharCarrinho(itens, unidadeId);
  const calculo = calcularBeneficios({ carrinho, unidadeId, usuario: auth.usuario, saldoPontos, beneficio });
  const { resumo } = calculo;
  const quantidadeCarrinho = itens.reduce((total, item) => total + item.quantidade, 0);
  const pagamento = useCheckout({ itens, unidadeId, modo, beneficio, usuario: auth.usuario, saldoPontos, onAprovado: novoPedido => {
    fidelidade.consumir(novoPedido);
    acompanhamento.registrar(novoPedido);
    setBeneficio(null);
    setEstado(atual => ({ ...atual, itens: [] }));
    setFeedback('');
  } });
  const processando = pagamento.checkout.etapa === 'processando';

  function validarEdicao() {
    if (pagamento.ocupado()) throw new Error('Aguarde o processamento do pagamento antes de alterar o pedido.');
    pagamento.resetar();
  }

  useEffect(() => {
    try { setSemPersistencia(!persistirCarrinho(window.localStorage, estado)); }
    catch { setSemPersistencia(true); }
  }, [estado]);

  function adicionarAoCarrinho(produtoId, quantidade) {
    validarEdicao();
    adicionarItem(itens, unidadeId, produtoId, quantidade);
    setEstado(atual => ({ ...atual, itens: adicionarItem(atual.itens, atual.unidadeId, produtoId, quantidade) }));
    setFeedback('');
  }

  function atualizarQuantidade(produtoId, quantidade) {
    validarEdicao();
    alterarQuantidade(itens, unidadeId, produtoId, quantidade);
    setEstado(atual => ({ ...atual, itens: alterarQuantidade(atual.itens, atual.unidadeId, produtoId, quantidade) }));
    setFeedback('Quantidade atualizada. Os valores foram recalculados.');
  }

  function removerDoCarrinho(produtoId) {
    if (pagamento.ocupado()) return;
    pagamento.resetar();
    const nome = carrinho.find(item => item.produtoId === produtoId)?.produto.nome;
    if (itens.length === 1) setBeneficio(null);
    setEstado(atual => ({ ...atual, itens: atual.itens.filter(item => item.produtoId !== produtoId) }));
    setFeedback(`${nome || 'Produto'} removido do carrinho.`);
  }

  function aplicarAlteracao(alteracao) {
    if (pagamento.ocupado()) return;
    pagamento.resetar();
    setBeneficio(null);
    if (alteracao.tipo === 'encerrar' || alteracao.tipo === 'canal' || modo === 'totem') {
      auth.limparAtendimento();
      fidelidade.limpar();
      privacidade.limpar();
    }
    if (alteracao.tipo !== 'unidade' || modo === 'totem') acompanhamento.limpar();
    setEstado(atual => {
      if (alteracao.tipo === 'unidade') return { ...atual, unidadeId: alteracao.valor, itens: [], sessao: atual.sessao + 1 };
      if (alteracao.tipo === 'canal') return { ...atual, modo: alteracao.valor, unidadeId: 'centro', itens: [], sessao: atual.sessao + 1 };
      return { ...estadoInicial(), modo: atual.modo, sessao: atual.sessao + 1 };
    });
    setPendente(null);
    setFeedback(alteracao.tipo === 'encerrar' ? 'Atendimento encerrado. Tudo pronto para um novo atendimento.' : 'Alteração concluída. O carrinho está vazio.');
    if (alteracao.tipo !== 'unidade') window.location.hash = '/cardapio';
  }

  function trocarUnidade(valor) {
    if (pagamento.ocupado()) return;
    if (valor === unidadeId || !listarUnidades().some(unidade => unidade.id === valor && unidade.ativa)) return;
    const alteracao = { tipo: 'unidade', valor };
    if (itens.length) setPendente(alteracao);
    else aplicarAlteracao(alteracao);
  }

  function trocarCanal(valor) {
    if (pagamento.ocupado()) return;
    if (valor === modo || !['mobile', 'web', 'totem'].includes(valor)) return;
    if (valor === 'totem' || modo === 'totem') {
      const alteracao = { tipo: 'canal', valor };
      if (itens.length) setPendente(alteracao);
      else aplicarAlteracao(alteracao);
    } else {
      pagamento.resetar();
      setEstado(atual => ({ ...atual, modo: valor }));
    }
  }

  function encerrarAtendimento() {
    if (pagamento.ocupado()) return;
    if (itens.length) setPendente({ tipo: 'encerrar' });
    else aplicarAlteracao({ tipo: 'encerrar' });
  }

  const tituloConfirmacao = pendente?.tipo === 'unidade' ? 'Trocar de unidade?' : pendente?.tipo === 'canal' ? 'Alterar o canal de atendimento?' : 'Encerrar atendimento?';

  function atualizarPedido(id, esperado, destino) {
    if (pagamento.ocupado()) throw new Error('Aguarde o processamento do pagamento.');
    const atualizados = acompanhamento.atualizar(id, esperado, destino, auth.usuario?.perfil);
    fidelidade.creditar(atualizados);
  }

  function carregarExemplos() {
    if (!pagamento.ocupado()) acompanhamento.carregarExemplos();
  }

  function aplicarBeneficio(novo) {
    validarEdicao();
    const escolhido = selecionarBeneficio(beneficio, novo);
    const resultado = calcularBeneficios({ carrinho, unidadeId, usuario: auth.usuario, saldoPontos, beneficio: escolhido });
    if (resultado.erro) throw new Error(resultado.erro);
    setBeneficio(escolhido);
    setFeedback('Benefício aplicado ao carrinho. O total foi recalculado.');
  }

  function aplicarCupom(codigo) {
    aplicarBeneficio({ tipo: 'cupom', codigo: codigo.trim().toUpperCase() });
  }

  function reservarRecompensa(id) {
    aplicarBeneficio({ tipo: 'recompensa', id, usuarioId: auth.usuario?.id });
  }

  function removerBeneficio() {
    if (pagamento.ocupado()) return;
    pagamento.resetar();
    setBeneficio(null);
    setFeedback('Benefício removido. Nenhum ponto foi descontado.');
  }

  function entrar(dados) {
    if (pagamento.ocupado()) throw new Error('Aguarde o pagamento terminar antes de entrar na conta.');
    auth.entrar(dados);
    setBeneficio(null);
    pagamento.resetar();
    setFeedback('Entrada demonstrativa concluída.');
  }

  function cadastrar(dados) {
    if (pagamento.ocupado()) throw new Error('Aguarde o pagamento terminar antes de cadastrar uma conta.');
    auth.cadastrar(dados);
    setBeneficio(null);
    pagamento.resetar();
    setFeedback('Conta fictícia criada. Você já entrou na demonstração.');
  }

  function sair() {
    if (pagamento.ocupado()) return;
    auth.sair();
    privacidade.limpar();
    setBeneficio(null);
    if (modo === 'totem') fidelidade.limpar();
    pagamento.resetar();
    if (modo === 'totem') acompanhamento.limpar();
    setEstado(atual => ({ ...atual, sessao: atual.sessao + 1 }));
    setFeedback('Você saiu da conta. O cardápio continua disponível sem login.');
    window.location.hash = '/login';
  }

  function trocarPerfil(perfil) {
    if (pagamento.ocupado()) return;
    auth.trocarPerfil(perfil);
    setBeneficio(null);
    pagamento.resetar();
    setFeedback('Perfil de demonstração alterado.');
  }

  function salvarPreferencias(preferencias) {
    if (!pagamento.ocupado()) privacidade.salvar(preferencias);
  }

  return (
    <Layout modo={modo} onChangeModo={trocarCanal} quantidadeCarrinho={quantidadeCarrinho} onEncerrar={encerrarAtendimento} processando={processando} temPedido={!!pedido} usuario={auth.usuario} onSair={sair}>
      {semPersistencia && modo !== 'totem' && <p role="status">O armazenamento está indisponível. Seu carrinho será mantido apenas nesta sessão.</p>}
      <Navegacao key={sessao} unidadeId={unidadeId} onChangeUnidade={trocarUnidade}
        preferencias={privacidade.preferencias} onSalvarPreferencias={salvarPreferencias}
        modo={modo} usuario={auth.usuario} onEntrar={entrar} onCadastrar={cadastrar} onSair={sair} onPerfil={trocarPerfil}
        processando={processando} checkout={pagamento.checkout} onConfirmarPedido={pagamento.confirmar}
        onPagar={pagamento.enviar} onRevisar={pagamento.resetar} pedido={pedido} pedidos={pedidos} onAtualizarPedido={atualizarPedido} onCarregarExemplos={carregarExemplos}
        beneficio={beneficio} beneficioAplicado={calculo.aplicado} erroBeneficio={calculo.erro} saldoPontos={saldoPontos} fidelidadeEstado={fidelidade.estado}
        onCupom={aplicarCupom} onRecompensa={reservarRecompensa} onRemoverBeneficio={removerBeneficio}
        carrinho={carrinho} resumo={resumo} checkoutPermitido={podeFinalizar(itens, unidadeId) && !calculo.erro}
        onAdicionar={adicionarAoCarrinho} onRemover={removerDoCarrinho} onQuantidade={atualizarQuantidade} />
      <div className="feedback-carrinho" role="status">{feedback}</div>
      {pendente && <Confirmacao titulo={tituloConfirmacao}
        descricao="Os produtos do carrinho atual serão removidos. Esta ação não pode ser desfeita. Deseja continuar?"
        confirmar={pendente.tipo === 'encerrar' ? 'Encerrar e limpar' : 'Limpar e continuar'}
        onConfirmar={() => aplicarAlteracao(pendente)} onCancelar={() => setPendente(null)} />}
    </Layout>
  );
}
