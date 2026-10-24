import { listarUnidades } from './cardapioService.js';
import { adicionarItem } from './carrinhoService.js';

export const CHAVE_CARRINHO = 'raizes-do-nordeste:carrinho:v1';

export function estadoInicial() {
  return { modo: 'mobile', unidadeId: 'centro', itens: [], sessao: 0 };
}

export function restaurarCarrinho(storage) {
  const padrao = estadoInicial();
  try {
    const salvo = JSON.parse(storage.getItem(CHAVE_CARRINHO));
    if (!salvo || salvo.versao !== 1 || !['mobile', 'web', 'totem'].includes(salvo.modo)) return padrao;
    // Totem nunca restaura itens de um atendimento anterior.
    if (salvo.modo === 'totem') return { ...padrao, modo: 'totem' };
    if (!listarUnidades().some(unidade => unidade.id === salvo.unidadeId && unidade.ativa)) return padrao;
    let itens = [];
    if (Array.isArray(salvo.itens)) {
      for (const item of salvo.itens) {
        try { itens = adicionarItem(itens, salvo.unidadeId, item.produtoId, item.quantidade); }
        catch { /* Descarta registros inválidos, de outra unidade ou indisponíveis. */ }
      }
    }
    return { ...padrao, modo: salvo.modo, unidadeId: salvo.unidadeId, itens };
  } catch {
    return padrao;
  }
}

export function persistirCarrinho(storage, estado) {
  try {
    const { modo, unidadeId, itens } = estado;
    // Persiste somente o canal no Totem, sem produtos ou unidade do atendimento.
    const dados = modo === 'totem'
      ? { versao: 1, modo, unidadeId: 'centro', itens: [] }
      : { versao: 1, modo, unidadeId, itens };
    storage.setItem(CHAVE_CARRINHO, JSON.stringify(dados));
    return true;
  } catch {
    return false;
  }
}
