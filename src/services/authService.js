import { CODIGO_DEMONSTRATIVO, perfis } from '../data/usuarios.js';

export class ErroFormulario extends Error {
  constructor(message, campos = {}) {
    super(message);
    this.campos = campos;
  }
}

export const normalizarEmail = email => String(email || '').trim().toLowerCase();

function validarEmail(email) {
  if (!email) return 'Informe um e-mail fictício.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Informe um e-mail no formato nome@exemplo.test.';
  return '';
}

export function cadastrarUsuario(usuarios, dados) {
  const nome = String(dados.nome || '').trim();
  const email = normalizarEmail(dados.email);
  const campos = {};
  if (nome.length < 2) campos.nome = 'Informe um nome fictício com pelo menos 2 caracteres.';
  const erroEmail = validarEmail(email);
  if (erroEmail) campos.email = erroEmail;
  if (!perfis.some(perfil => perfil.id === dados.perfil)) campos.perfil = 'Escolha um perfil de demonstração.';
  if (Object.keys(campos).length) throw new ErroFormulario('Confira os campos indicados para criar sua conta demonstrativa.', campos);
  if (usuarios.some(usuario => normalizarEmail(usuario.email) === email)) {
    throw new ErroFormulario('Este e-mail já está cadastrado nesta demonstração. Entre na conta ou use outro e-mail fictício.', { email: 'E-mail já cadastrado.' });
  }
  return { id: `usuario-demo-${crypto.randomUUID()}`, nome, email, perfil: dados.perfil };
}

export function autenticarUsuario(usuarios, dados) {
  const email = normalizarEmail(dados.email);
  const campos = {};
  const erroEmail = validarEmail(email);
  if (erroEmail) campos.email = erroEmail;
  if (!dados.codigo?.trim()) campos.codigo = 'Informe o código público RAIZES-DEMO.';
  if (Object.keys(campos).length) throw new ErroFormulario('Confira os campos indicados para entrar.', campos);
  const usuario = usuarios.find(item => normalizarEmail(item.email) === email);
  if (!usuario || dados.codigo.trim() !== CODIGO_DEMONSTRATIVO) {
    throw new ErroFormulario('Credenciais demonstrativas inválidas. Confira o e-mail cadastrado e o código RAIZES-DEMO.');
  }
  return { ...usuario };
}

export function selecionarPerfil(usuario, perfil) {
  if (!usuario || !perfis.some(item => item.id === perfil)) throw new ErroFormulario('Escolha um perfil demonstrativo válido.');
  return { ...usuario, perfil };
}
