export const opcoesPrivacidade = [
  { id: 'campanhas', titulo: 'Comunicações promocionais demonstrativas', descricao: 'Registrar nesta sessão a preferência por receber novidades fictícias. Nenhuma mensagem, e-mail ou notificação será enviada.' },
  { id: 'estatisticas', titulo: 'Estatísticas demonstrativas de uso', descricao: 'Simular uma escolha sobre estatísticas opcionais. Este protótipo não instala rastreadores nem transmite eventos de navegação, mesmo quando a opção é aceita.' },
];

export const finalidadesDados = [
  { dados: 'Nome e e-mail fictícios, perfil e código público', finalidade: 'Demonstrar cadastro, identificação visual e navegação por perfil.', armazenamento: 'Contas e sessão apenas em memória; o código público não é salvo no cadastro. Recarregar encerra o login.' },
  { dados: 'Unidade, canal, referências de produtos e quantidades', finalidade: 'Montar o carrinho e restaurar a seleção no Mobile/Web.', armazenamento: 'localStorage do próprio navegador no Mobile/Web. Totem grava apenas o canal com unidade padrão e carrinho vazio.' },
  { dados: 'Pedidos fictícios, valores, status, identificadores de conta, pontos e resgates', finalidade: 'Demonstrar checkout, preparo, retirada, promoções e fidelidade.', armazenamento: 'Somente em memória durante esta sessão. Não são enviados a um backend.' },
  { dados: 'Preferências opcionais de privacidade', finalidade: 'Demonstrar consulta, alteração e revogação das escolhas.', armazenamento: 'Somente em memória, sem associação persistente a uma conta. Recarregar restaura todas as opções desmarcadas.' },
];
