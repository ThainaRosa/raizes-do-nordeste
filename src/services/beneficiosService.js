import { campanhas, recompensas } from '../data/beneficios.js';
import { calcularResumo } from './carrinhoService.js';

export function situacaoCampanha(campanha, agora = new Date()) {
  if (agora > new Date(campanha.fim)) return 'Encerrada';
  if (agora < new Date(campanha.inicio)) return 'Em breve';
  return 'Disponível';
}

export function validarCupom(codigo, { subtotalCentavos, unidadeId, usuario, agora = new Date() }) {
  const cupom = campanhas.find(item => item.codigo === String(codigo || '').trim().toUpperCase());
  if (!cupom) throw new Error('Cupom inexistente. Confira o código nas campanhas fictícias.');
  if (agora > new Date(cupom.fim)) throw new Error('Este cupom está vencido. Escolha outra campanha.');
  if (agora < new Date(cupom.inicio)) throw new Error('Esta campanha ainda não começou.');
  if (cupom.unidadeId && cupom.unidadeId !== unidadeId) throw new Error('Cupom inelegível: válido apenas na Unidade Centro.');
  if (cupom.somenteCliente && usuario?.perfil !== 'cliente') throw new Error('Cupom inelegível: entre no perfil Cliente para usar esta campanha.');
  if (subtotalCentavos < cupom.minimoCentavos) throw new Error(`Cupom inelegível: o subtotal mínimo é R$ ${(cupom.minimoCentavos / 100).toFixed(2).replace('.', ',')}.`);
  return cupom;
}

export function validarRecompensa(id, { usuario, saldoPontos, usuarioId, subtotalCentavos }) {
  if (!usuario || usuario.perfil !== 'cliente') throw new Error('Entre no perfil Cliente para usar recompensas.');
  if (usuario.id !== usuarioId) throw new Error('Esta recompensa pertence a outra conta demonstrativa.');
  const recompensa = recompensas.find(item => item.id === id);
  if (!recompensa) throw new Error('Recompensa inexistente.');
  if (saldoPontos < recompensa.pontos) throw new Error(`Saldo insuficiente: são necessários ${recompensa.pontos} pontos.`);
  if (subtotalCentavos <= 0) throw new Error('Adicione produtos ao carrinho antes de reservar uma recompensa.');
  return recompensa;
}

export function calcularBeneficios({ carrinho, unidadeId, usuario, saldoPontos = 0, beneficio = null, agora }) {
  const base = calcularResumo(carrinho);
  if (!beneficio) return { resumo: base, aplicado: null, erro: '' };
  try {
    let desconto;
    let aplicado;
    const contexto = { subtotalCentavos: base.subtotalCentavos, unidadeId, usuario, saldoPontos, agora };
    if (beneficio.tipo === 'cupom') {
      const cupom = validarCupom(beneficio.codigo, contexto);
      desconto = cupom.tipo === 'fixo' ? cupom.valor : Math.round(base.subtotalCentavos * cupom.valor / 100);
      desconto = Math.min(desconto, cupom.limiteCentavos ?? desconto);
      aplicado = { tipo: 'cupom', codigo: cupom.codigo, descricao: `Cupom ${cupom.codigo}` };
    } else if (beneficio.tipo === 'recompensa') {
      const recompensa = validarRecompensa(beneficio.id, { ...contexto, usuarioId: beneficio.usuarioId });
      desconto = recompensa.descontoCentavos;
      aplicado = { tipo: 'recompensa', id: recompensa.id, usuarioId: usuario.id, pontos: recompensa.pontos, descricao: recompensa.nome };
    } else throw new Error('Benefício inválido. Remova-o e escolha novamente.');
    const resumo = calcularResumo(carrinho, desconto);
    return { resumo, aplicado: { ...aplicado, descontoCentavos: resumo.descontoCentavos }, erro: '' };
  } catch (error) {
    return { resumo: base, aplicado: null, erro: error.message };
  }
}

export function selecionarBeneficio(atual, novo) {
  if (atual) throw new Error('Já existe um benefício selecionado. Remova-o antes de aplicar outro.');
  return novo;
}
