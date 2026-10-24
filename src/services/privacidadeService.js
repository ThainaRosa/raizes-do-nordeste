import { opcoesPrivacidade } from '../data/privacidade.js';

export function preferenciasIniciais() {
  return Object.fromEntries(opcoesPrivacidade.map(opcao => [opcao.id, false]));
}

export function validarPreferencias(dados) {
  return Object.fromEntries(opcoesPrivacidade.map(opcao => [opcao.id, dados?.[opcao.id] === true]));
}
