export const campanhas = [
  { codigo: 'SABOR10', nome: 'Uma pausa com mais sabor', descricao: '10% de desconto em pedidos a partir de R$ 20,00, limitado a R$ 12,00.', tipo: 'percentual', valor: 10, minimoCentavos: 2000, limiteCentavos: 1200, inicio: '2026-01-01T00:00:00-03:00', fim: '2030-12-31T23:59:59-03:00' },
  { codigo: 'CENTRO5', nome: 'Encontro no Centro', descricao: 'R$ 5,00 de desconto na Unidade Centro em pedidos a partir de R$ 25,00.', tipo: 'fixo', valor: 500, minimoCentavos: 2500, unidadeId: 'centro', inicio: '2026-01-01T00:00:00-03:00', fim: '2030-12-31T23:59:59-03:00' },
  { codigo: 'CLIENTE15', nome: 'Carinho de casa', descricao: '15% para o perfil Cliente autenticado, a partir de R$ 40,00. Desconto máximo de R$ 15,00.', tipo: 'percentual', valor: 15, minimoCentavos: 4000, limiteCentavos: 1500, somenteCliente: true, inicio: '2026-01-01T00:00:00-03:00', fim: '2030-12-31T23:59:59-03:00' },
  { codigo: 'VOLTE5', nome: 'Campanha encerrada', descricao: 'Campanha fictícia encerrada: R$ 5,00 a partir de R$ 20,00. Disponível para testar cupom vencido.', tipo: 'fixo', valor: 500, minimoCentavos: 2000, inicio: '2025-01-01T00:00:00-03:00', fim: '2025-12-31T23:59:59-03:00' },
];

export const recompensas = [
  { id: 'pausa', nome: 'Pausa de R$ 5', pontos: 50, descontoCentavos: 500 },
  { id: 'sabores', nome: 'Sabores de R$ 12', pontos: 100, descontoCentavos: 1200 },
  { id: 'mesa', nome: 'Mesa de R$ 25', pontos: 300, descontoCentavos: 2500 },
];

export const saldosIniciais = { 'demo-cliente': 120 };
export const regraFidelidade = 'Ganhe 1 ponto por real inteiro do total pago após descontos. Apenas pedidos feitos no perfil Cliente, com pagamento simulado aprovado e status Retirado, geram pontos. Pedidos de exemplo não pontuam.';
export const regraBeneficios = 'Use um cupom ou uma recompensa por pedido. Benefícios não são cumulativos. O desconto fica limitado ao subtotal. A recompensa reserva pontos no carrinho e só os desconta após aprovação; recusa ou falha mantém o saldo.';
