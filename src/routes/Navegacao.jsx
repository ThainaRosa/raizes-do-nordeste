import { useEffect, useState } from 'react';
import CardapioPage from '../pages/CardapioPage.jsx';
import NaoEncontradaPage from '../pages/NaoEncontradaPage.jsx';
import CarrinhoPage from '../pages/CarrinhoPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import PedidoPage from '../pages/PedidoPage.jsx';
import PedidosPage from '../pages/PedidosPage.jsx';
import PromocoesPage from '../pages/PromocoesPage.jsx';
import FidelidadePage from '../pages/FidelidadePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import CadastroPage from '../pages/CadastroPage.jsx';
import ContaPage from '../pages/ContaPage.jsx';
import PerfilPage from '../pages/PerfilPage.jsx';
import PrivacidadePage from '../pages/PrivacidadePage.jsx';
import { perfis } from '../data/usuarios.js';

// Registre novas páginas aqui, mantendo o layout compartilhado.
// O hash permite recarregar links diretos sem configurar rotas no servidor.
const rotas = {
  '/': CardapioPage,
  '/cardapio': CardapioPage,
  '/carrinho': CarrinhoPage,
  '/checkout': CheckoutPage,
  '/pedido': PedidoPage,
  '/pedidos': PedidosPage,
  '/promocoes': PromocoesPage,
  '/fidelidade': FidelidadePage,
  '/login': LoginPage,
  '/cadastro': CadastroPage,
  '/conta': ContaPage,
  '/privacidade': PrivacidadePage,
};

function obterCaminho() {
  return window.location.hash.slice(1) || '/';
}

export default function Navegacao(props) {
  const [caminho, setCaminho] = useState(obterCaminho);

  useEffect(() => {
    const atualizarCaminho = () => setCaminho(obterCaminho());
    window.addEventListener('hashchange', atualizarCaminho);
    return () => window.removeEventListener('hashchange', atualizarCaminho);
  }, []);

  useEffect(() => {
    const conteudo = document.querySelector('main');
    const destino = conteudo?.querySelector('h2') || conteudo;
    if (destino) {
      destino.tabIndex = -1;
      destino.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [caminho]);

  const [rota, busca = ''] = caminho.split('?');
  const parametros = new URLSearchParams(busca);
  const perfilDaRota = perfis.find(perfil => perfil.caminho === rota)?.id;
  const Pagina = props.processando ? CheckoutPage : perfilDaRota ? PerfilPage : Object.hasOwn(rotas, rota) ? rotas[rota] : NaoEncontradaPage;
  return <Pagina {...props} perfilDaRota={perfilDaRota} numeroPedido={parametros.get('numero')} />;
}
