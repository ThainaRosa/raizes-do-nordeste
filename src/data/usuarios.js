// Dados públicos e fictícios, exclusivos para a demonstração acadêmica.
export const CODIGO_DEMONSTRATIVO = 'RAIZES-DEMO';

export const perfis = [
  { id: 'cliente', nome: 'Cliente', caminho: '/area-cliente', titulo: 'Área do cliente', descricao: 'Explore o cardápio, monte seu carrinho e acompanhe seu pedido.' },
  { id: 'atendente', nome: 'Atendente', caminho: '/atendimento', titulo: 'Área de atendimento', descricao: 'Demonstração da conferência de pedidos e do atendimento da unidade.' },
  { id: 'cozinha', nome: 'Cozinha', caminho: '/cozinha', titulo: 'Área da cozinha', descricao: 'Demonstração da consulta do pedido recebido e de suas etapas de preparo.' },
  { id: 'gerente', nome: 'Gerente/Administrador', caminho: '/gestao', titulo: 'Área de gestão', descricao: 'Consulte as unidades e os produtos mockados que compõem esta demonstração.' },
];

export const usuariosDemonstrativos = [
  { id: 'demo-cliente', nome: 'Ana do Sertão', email: 'cliente@raizes.example', perfil: 'cliente' },
  { id: 'demo-atendente', nome: 'João da Feira', email: 'atendente@raizes.example', perfil: 'atendente' },
  { id: 'demo-cozinha', nome: 'Rosa do Agreste', email: 'cozinha@raizes.example', perfil: 'cozinha' },
  { id: 'demo-gerente', nome: 'Maria das Raízes', email: 'gerente@raizes.example', perfil: 'gerente' },
];
