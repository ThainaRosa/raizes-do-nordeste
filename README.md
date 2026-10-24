# Raízes do Nordeste — Front-End (Etapa 5)

Consulte [REVISAO.md](REVISAO.md) para a revisão funcional, correções, resultados executados,
limitações e roteiro manual. A regressão opcional de navegador está em
`scripts/revisao-navegador.cjs`, usando Playwright fornecido externamente ao projeto.

Projeto multidisciplinar (Opção B) com cardápio, carrinho, checkout e acompanhamento de pedidos demonstrativos, sem backend ou pagamentos reais.

## Requisitos
- Node.js LTS instalado
- npm

## Executar localmente
```bash
npm install
npm run dev
```
Abra o endereço local exibido pelo Vite (normalmente `http://localhost:5173`).

## Compilar
```bash
npm run build
npm run preview
```

## Organização
- `src/App.jsx`: mantém o modo de exibição e a unidade selecionada entre páginas.
- `src/components/`: `Layout`, `Cabecalho`, `Rodape`, `SeletorUnidade` e `ProdutoCard`, reutilizáveis.
- `src/pages/`: cardápio, carrinho, checkout, acompanhamento, login, cadastro, conta, áreas por perfil e página não encontrada.
- `src/hooks/useAuth.js`: registro de contas e sessão demonstrativa somente em memória.
- `src/hooks/usePedidos.js`: coleção compartilhada de pedidos, registro e atualizações atômicas na sessão.
- `src/services/pedidoService.js`: consulta, exemplos, histórico e validação das transições de status.
- `src/data/pedidos.js`: sequência de etapas, ações por perfil e referências para pedidos de exemplo.
- `src/data/beneficios.js`: campanhas, recompensas, saldos iniciais e regras demonstrativas.
- `src/services/beneficiosService.js`: elegibilidade de cupons/recompensas e cálculo em centavos.
- `src/services/fidelidadeService.js` e `src/hooks/useFidelidade.js`: créditos e resgates por conta, sem duplicidade.
- `src/services/operacionalService.js`: fila da cozinha, prioridade de retirada e indicadores simulados da gestão.
- `src/components/FilaCozinha.jsx` e `PainelGerente.jsx`: visões operacionais compartilhando os pedidos da sessão.
- `src/data/privacidade.js`, `src/services/privacidadeService.js` e `src/hooks/usePrivacidade.js`: finalidades, opções e escolhas em memória.
- `src/pages/PrivacidadePage.jsx`: aviso e formulário de preferências opcionais.
- `src/services/authService.js`: validações, cadastro, login e seleção demonstrativa de perfil.
- `src/data/usuarios.js`: usuários fictícios, código público e configuração dos perfis.
- `src/hooks/useCheckout.js`: confirmação, processamento, resultados e bloqueio de envios simultâneos.
- `src/services/pagamentoService.js`: fotografia do pedido e simulação assíncrona de pagamento.
- `src/data/pagamento.js`: métodos fictícios, cenários e etapas do pedido.
- `src/routes/Navegacao.jsx`: registro das páginas e navegação por hash, sem dependências adicionais.
- `src/data/`: dados mockados de unidades e produtos, preservados.
- `src/services/cardapioService.js`: consultas síncronas aos mocks, retornando cópias dos dados, sem backend.
- `src/utils/formatarMoeda.js`: formatação compartilhada de preços em reais.
- `src/styles/global.css`: estilos básicos, controles e painel compartilhado.
- `src/styles/layout.css`: cabeçalho, conteúdo, rodapé e modos de exibição.
- `src/styles/cardapio.css`: apresentação da página e dos cards.
- `public/images/`: `tapioca.jpg`, `cuscuz.jpg`, `suco-caja.jpg` e `baiao-de-dois.jpg`.

O CSS começa com uma coluna para telas pequenas, amplia o cardápio a partir de 700px
e reorganiza o cabeçalho a partir de 800px.
Mobile limita o conteúdo a 480px; Web usa até 1160px; Totem usa até 1250px e controles maiores.
O modo selecionado é independente da largura da tela e todos os modos continuam responsivos.

## Navegação e novas telas

A aplicação abre o cardápio sem hash, em `#/` ou em `#/cardapio`.
Endereços desconhecidos exibem uma página com link de retorno.
O hash funciona com os botões voltar/avançar do navegador e com recarga de links diretos.
Não é necessário configurar redirecionamentos no servidor.

Para adicionar uma tela, crie um componente em `src/pages/`, importe-o e registre seu
caminho em `rotas` dentro de `src/routes/Navegacao.jsx`. Adicione o link correspondente
no cabeçalho usando `href="#/caminho"`. Preserve o layout compartilhado e coloque
consultas a dados em `src/services/`, em vez de importar mocks nos componentes visuais.
No Mobile/Web, unidade, canal e carrinho são restaurados do armazenamento local.
Busca, filtros e modais ficam em memória. No Totem, nenhum item é restaurado.

## Conferência manual

1. Execute `npm run dev` e abra o endereço indicado pelo Vite.
2. Na Unidade Centro, confira tapioca, cuscuz e suco de cajá, com fotos e preços.
3. Troque para Unidade Shopping e confira apenas o baião de dois.
4. Alterne Mobile, Web e Totem; confira também uma janela estreita de 320px.
5. Navegue pelo teclado e confira o foco nos links e seletores.
6. Abra `#/inexistente`, use o link de retorno, teste voltar/avançar e recarregue `#/cardapio`.
7. Execute `npm run build` e `npm run preview` para conferir a versão compilada.

## Identidade visual e catálogo

A interface usa tons de barro, areia e verde, títulos serifados e uma marca tipográfica.
A abertura apresenta uma foto da unidade selecionada, seguida pelo seletor de unidade,
pelos destaques e pelo cardápio com filtros de categoria. O campo `destaque` dos mocks
define a seleção editorial da casa; não representa estatísticas reais de vendas.
As descrições também são demonstrativas.

`src/components/ImagemProduto.jsx` centraliza imagens proporcionais com `object-fit: cover`
e uma alternativa visual acessível quando o arquivo está ausente ou falha ao carregar.
Não há imagens externas nem bibliotecas visuais adicionais.

Para conferir a alternativa visual, bloqueie uma imagem nas ferramentas do navegador
ou altere temporariamente seu caminho nos mocks, recarregue e depois restaure o caminho.
Confira também os filtros de categoria, sua reinicialização ao trocar de unidade e o
botão “Explorar o cardápio”, que desloca o foco para o título da seção.

No PowerShell, se a política de execução bloquear `npm.ps1`, use `npm.cmd`
nos mesmos comandos, por exemplo `npm.cmd run dev`.

## Plano das próximas etapas
Cardápio, carrinho, checkout simulado, acompanhamento, conta, promoções, fidelidade,
visões operacionais e preferências demonstrativas de privacidade estão disponíveis.
O projeto continua sendo uma demonstração acadêmica de Front-End. A presença dessas
telas não oferece segurança de produção nem comprova conformidade integral com a LGPD.

**Nota:** O seletor de modo Mobile/Web/Totem é uma demonstração visual inicial, não substitui testes reais em dispositivos.

## Módulo de cardápio e carrinho local

- A busca por nome ignora acentos e maiúsculas e funciona junto com a categoria.
- “Ver detalhes” abre um diálogo nativo com foto, descrição, disponibilidade, preço,
  quantidade de 1 a 99 e subtotal. Esc ou “Fechar” fecha o diálogo e devolve o foco
  ao botão de origem. A navegação com Tab e Shift+Tab mantém o foco nos controles do diálogo.
- Produtos indisponíveis podem ser consultados, mas não adicionados. A validação
  também ocorre no serviço, incluindo unidade e limite acumulado de quantidade.
- A rota `#/carrinho` permite aumentar, diminuir e editar quantidades de 1 a 99,
  remover itens e visualizar subtotal, descontos e total recalculados automaticamente.
  Confirme a edição direta com Enter ou ao sair do campo. Valores inválidos são
  rejeitados e o campo recupera a última quantidade válida, com mensagem de erro.
- Um único carrinho pertence à unidade ativa. Trocar de unidade com itens abre uma
  confirmação acessível: cancelar mantém unidade e itens; confirmar limpa o carrinho
  e redefine filtros, seleção de produto e mensagens do atendimento anterior.
- `src/services/carrinhoService.js` guarda somente IDs e quantidades, resolve os
  produtos pelos mocks e calcula subtotais em centavos. Descontos são limitados ao
  subtotal e o total nunca é negativo. Cupons e recompensas são calculados pelo serviço
  de benefícios e revalidados na confirmação e no envio do checkout.
- O botão de conferência fica bloqueado com carrinho vazio ou produtos indisponíveis.
  Ele abre o checkout com revisão, confirmação e pagamento inteiramente simulado.
- `QuantidadeControle`, `CarrinhoItem`, `ResumoCarrinho` e `Confirmacao` são componentes
  reutilizáveis para controles, apresentação dos itens, valores e confirmações.
- `src/styles/compra.css` reúne estilos da busca, detalhes e carrinho.

### Persistência e modo Totem

`src/services/persistenciaCarrinho.js` usa a chave versionada
`raizes-do-nordeste:carrinho:v1` no `localStorage`. Mobile/Web restauram apenas IDs e
quantidades válidas da unidade selecionada, com preços sempre consultados nos mocks.
JSON inválido, produtos indisponíveis, unidade incorreta e falhas de armazenamento são
tratados. Sem acesso ao armazenamento, a aplicação continua em memória e informa isso.

Totem não grava itens nem unidade do atendimento: persiste somente o canal e valores
vazios para evitar restaurar dados do cliente anterior. Entrar ou sair do Totem inicia
uma sessão limpa, com confirmação se houver itens. “Encerrar atendimento” também pede
confirmação quando necessário e limpa itens, pedido aprovado, checkout, unidade, busca,
filtros, modais e mensagens do atendimento, retornando ao cardápio. Recarregar o Totem
começa sem itens. O encerramento é bloqueado durante o processamento para não interromper
a resposta da simulação.

Execute `npm run test` (ou `npm.cmd test` no PowerShell) para testar os serviços com
o executor nativo do Node.js, sem instalar bibliotecas de testes.
Para testar a indisponibilidade na interface, altere temporariamente `disponivel`
para `false` em um produto de `src/data/produtos.js`, confira o modal e restaure o valor.
Confira também busca sem resultados, soma de adições repetidas, tentativa de ultrapassar
99 unidades, troca de unidade, remoção e uso de Tab, Enter e Esc.
Confira ainda cancelamento e confirmação da troca de unidade, persistência após recarga,
bloqueio da conferência vazia e encerramento de atendimento no Totem.

## Checkout e pagamento simulado

1. No carrinho, use “Continuar para conferência” para abrir `#/checkout`.
2. Revise unidade, nomes dos produtos, quantidades, preços, subtotal e total.
3. Use “Confirmar dados do pedido” para liberar a etapa de pagamento.
4. Escolha Pix demonstrativo ou cartão demonstrativo. Não há campos de cartão,
   chaves Pix, QR Codes ou solicitação de dados financeiros reais.
5. Selecione o resultado controlado: aprovado, recusado ou falha técnica.
6. Use “Simular pagamento” e aguarde aproximadamente 1,5 segundo no estado
   “Processando pagamento”. Não há requisições externas, apenas uma Promise com
   latência local simulando a resposta de um provedor.
7. Recusa e falha mantêm o carrinho e permitem trocar método/cenário e tentar novamente,
   ou voltar à revisão. Aprovação gera um ID `RN-DEMO-...`, cria o pedido em estado
   `recebido`, registra o pagamento simulado aprovado e esvazia o carrinho.
8. “Acompanhar meu pedido” abre `#/pedido?numero=...`. A linha de etapas começa em
   “Recebido”. Perfis operacionais podem demonstrar preparo e retirada nas áreas de equipe
   ou nos detalhes do pedido; cada ação segue a sequência obrigatória.

Um bloqueio síncrono com `useRef` impede envios simultâneos mesmo antes do próximo render.
Durante o processamento, controles de edição, canal, encerramento e navegação ficam
bloqueados. Voltar pelo navegador ou alterar o hash mantém a tela de processamento até
o resultado, sem alterar a fotografia do pedido. Qualquer edição posterior do carrinho
exige uma nova confirmação. Uma resposta recusada ou uma falha nunca registra um pedido.

O pedido aprovado guarda os nomes, preços e quantidades confirmados, separados do carrinho.
Os pedidos ficam na coleção compartilhada em memória, disponível pela consulta no cabeçalho;
recarregar a página remove o acompanhamento. O carrinho Mobile/Web continua persistido e já estará vazio
após aprovação. Recarregar durante o processamento cancela a simulação e preserva o
carrinho Mobile/Web para recomeçar. Totem sempre inicia sem dados do atendimento anterior.

Os testes de `tests/pagamento.test.js` cobrem validação, fotografia do pedido, valores,
aprovação, recusa, falha recuperável e cancelamento da operação. Para conferir a interface,
repita os três cenários em cada canal, teste duplo clique e a limpeza após encerrar o Totem.

## Cadastro e autenticação demonstrativa

Rotas: `#/cadastro`, `#/login` e `#/conta`. O cabeçalho mostra nome e perfil quando a
conta está ativa, com links para a conta e a área do perfil, além do botão de logout.

Todas as contas usam o **código público `RAIZES-DEMO`**. Não há senhas, tokens,
cookies de autenticação ou solicitação de informações financeiras/pessoais reais.
Use somente nomes e e-mails fictícios. A sessão mockada e as verificações de perfil
são convenções de interface; não oferecem autenticação ou autorização de produção.

| Perfil | E-mail fictício | Área demonstrativa |
| --- | --- | --- |
| Cliente | cliente@raizes.example | `#/area-cliente` |
| Atendente | atendente@raizes.example | `#/atendimento` |
| Cozinha | cozinha@raizes.example | `#/cozinha` |
| Gerente/Administrador | gerente@raizes.example | `#/gestao` |

Na tela de login, os botões “Preencher” selecionam uma conta pronta; o usuário confirma
a entrada pelo formulário. No cadastro, informe nome, e-mail e perfil fictícios. O
cadastro valida obrigatórios, formato de e-mail, perfil e duplicidade (ignorando
maiúsculas e espaços externos). Ao concluir, a conta entra automaticamente na sessão.
Para entrar novamente após logout, use o e-mail cadastrado e o mesmo código público.
Os formulários apresentam resumo de erros com foco e mensagens associadas aos campos.

O registro de usuários e a sessão ficam exclusivamente na memória do hook `useAuth`.
Logout encerra a sessão e limpa a confirmação do checkout, preservando o carrinho para
navegação anônima. No Mobile/Web, a coleção fictícia de pedidos é preservada para permitir
alternar entre Cliente, Cozinha e Atendente durante a demonstração. No Totem, logout também
limpa os pedidos. Recarregar a página encerra o login e
descarta cadastros criados, mantendo disponíveis apenas as quatro contas de exemplo.
Nenhuma informação de autenticação é incluída no `localStorage` do carrinho.

Na conta, “Perfil para explorar” altera somente o perfil da sessão, sem mudar o usuário
mockado original. As áreas mostram links, dados existentes e ações simuladas de status
dos pedidos. Abrir uma área com outro perfil oferece o caminho
para selecionar o perfil correspondente. Visitantes podem entrar ou voltar ao cardápio.

No Totem, cardápio, carrinho e checkout continuam disponíveis sem autenticação.
Encerrar o atendimento limpa sessão e cadastros criados, além dos dados do pedido.
Entrar/sair do canal Totem também limpa a sessão; durante pagamento, ações de conta
e alterações de perfil ficam bloqueadas junto com a navegação.

Para conferir, teste login vazio, e-mail inválido, código incorreto, cadastro repetido,
cadastro válido e novo login após logout. Explore os quatro perfis e recarregue a página
para confirmar o fim da sessão. Repita no Totem e encerre o atendimento, verificando que
a conta anterior não aparece. `tests/auth.test.js` cobre validações, duplicidade,
credenciais, perfis e ausência de campos de senha/código nos registros retornados.

## Consulta e acompanhamento de pedidos

- `#/pedidos`: lista compartilhada com busca pelo número e filtro de status. O botão
  “Consultar número exato” abre os detalhes e informa quando o pedido não existe.
- `#/pedido?numero=RN-DEMO-1001`: exemplo de link direto aos detalhes de um pedido
  disponível na sessão. `#/pedido` abre o último pedido gerado pelo checkout, se houver.
- O checkout aprovado adiciona um novo pedido sem substituir os anteriores, preservando
  unidade, produtos, preços, quantidades e total confirmados. Recusa ou falha não registra pedido.
- A tela de detalhes apresenta número, unidade, produtos, valores, status, evolução com
  horários e identificação textual das etapas concluídas, atual e futuras.
- Em “Pronto para retirada”, o cliente recebe orientação para ir ao balcão da unidade
  indicada e apresentar o número demonstrativo. A equipe confirma a retirada.

| Status atual | Ação simulada | Próximo status | Perfis |
| --- | --- | --- | --- |
| Recebido | Iniciar preparo | Em preparo | Cozinha ou Gerente/Administrador |
| Em preparo | Marcar como pronto | Pronto para retirada | Cozinha ou Gerente/Administrador |
| Pronto para retirada | Confirmar retirada | Retirado | Atendente ou Gerente/Administrador |
| Retirado | Nenhuma | Estado final | — |

O serviço exige que o status esperado ainda seja o atual, aceita apenas a próxima etapa
e valida a compatibilidade do perfil. Assim, ações desatualizadas, repetidas, retrocessos
e saltos são rejeitados. Cada transição acrescenta status, horário e perfil ao histórico,
mantendo os dados comerciais do pedido. Essas regras são demonstrativas, sem autorização
de produção ou comunicação com backend.

“Carregar pedidos de exemplo” adiciona quatro pedidos opcionais (`RN-DEMO-1001` a
`RN-DEMO-1004`), um em cada status. Os nomes e preços são resolvidos pelos mocks existentes.
Carregar exemplos novamente não duplica pedidos nem reinicia os status já atualizados.
A consulta começa vazia e mostra mensagens específicas para ausência de registros, filtros
sem resultado e número não encontrado.

As áreas Atendente, Cozinha e Gerente exibem a mesma coleção e ações compatíveis com o perfil.
Para demonstrar o ciclo completo, carregue os exemplos ou conclua um checkout, entre como
Cozinha e use “Iniciar preparo” e “Marcar como pronto”. Troque para Atendente e confirme
a retirada. Use a conta para alternar os perfis ou faça logout e login em outra conta de exemplo.

Os pedidos não são gravados no `localStorage`. Encerrar o Totem ou entrar/sair desse canal
limpa toda a coleção e a sessão. Trocar de unidade no Mobile/Web preserva os pedidos já
registrados, cada um com sua unidade original. Recarregar a página começa sem pedidos.
Os testes em `tests/pedidos.test.js` verificam integração com checkout, valores, histórico,
consulta, perfis, transições inválidas e carregamento idempotente dos exemplos.

## Promoções e fidelidade

As rotas `#/promocoes` e `#/fidelidade` estão disponíveis no cabeçalho. Cupons podem ser
aplicados no carrinho ou nas campanhas. Recompensas são reservadas pela tela de fidelidade
e aplicadas ao carrinho. Apenas **um benefício por pedido**: remova o atual antes de trocar
de cupom ou recompensa. Repetir o mesmo cupom também é rejeitado, sem somar descontos.

| Cupom fictício | Regra |
| --- | --- |
| SABOR10 | 10% a partir de R$ 20,00, limitado a R$ 12,00 |
| CENTRO5 | R$ 5,00 a partir de R$ 25,00, apenas na Unidade Centro |
| CLIENTE15 | 15% a partir de R$ 40,00, limitado a R$ 15,00, exige perfil Cliente autenticado |
| VOLTE5 | Campanha encerrada em 2025, para demonstrar cupom vencido |

As três campanhas ativas são válidas de 01/01/2026 a 31/12/2030 (horário de São Paulo).
Códigos ignoram maiúsculas e espaços externos. Códigos inexistentes, vencidos ou
inelegíveis exibem mensagens específicas. Valores percentuais são arredondados para
centavos e limitados pelo teto da campanha e pelo subtotal.

O perfil Cliente autenticado ganha **1 ponto por real inteiro do total líquido pago**,
creditado somente no status **Retirado**, uma vez por pedido. Exemplo: total de R$ 34,02
gera 34 pontos. Pagamento aprovado sem retirada ainda não pontua. Pedidos de exemplo,
compras anônimas, compras feitas em perfis operacionais e pedidos de total zero não geram
pontos. A conta beneficiária é fotografada no checkout: trocar para Cozinha ou Atendente
para concluir o pedido não muda o titular dos pontos.

A conta `cliente@raizes.example` começa com **120 pontos fictícios**; as demais contas e
novos cadastros começam com zero. Recompensas: 50 pontos por até R$ 5,00; 100 pontos por
até R$ 12,00; 300 pontos por até R$ 25,00. O custo em pontos é fixo, sem troco se o subtotal
for menor que o desconto. É necessário ter produtos no carrinho e saldo suficiente.

Reservar uma recompensa não altera o saldo: os pontos só são debitados quando o pagamento
é aprovado, uma vez por pedido. Recusa e falha mantêm saldo e benefício para nova tentativa.
Remover o benefício antes da aprovação não consome pontos. O desconto e o custo ficam
registrados no pedido aprovado, separados das escolhas futuras do carrinho.

O carrinho e o checkout usam o mesmo serviço de cálculo. Se uma edição fizer o pedido
perder a elegibilidade, o desconto deixa de ser aplicado e o checkout fica bloqueado até
ajustar o carrinho ou remover o benefício. A confirmação é invalidada por edições e mudanças
de conta/perfil. Não há envio com um desconto silenciosamente diferente do confirmado.

Troca de unidade ou conta/perfil, logout e encerramento do atendimento removem o benefício
selecionado. Benefícios, saldos e movimentos ficam apenas em memória, sem dados adicionais
no `localStorage`. Logout Mobile/Web preserva os movimentos por conta para permitir alternar
os perfis da demonstração. Recarregar a página, encerrar o Totem ou entrar/sair desse canal
restaura os saldos iniciais fictícios e limpa créditos e resgates.

Para conferir: monte duas tapiocas (R$ 37,80), aplique SABOR10 e confira R$ 34,02. Reduza
para uma tapioca para ver a inelegibilidade e o bloqueio do checkout. Remova o cupom, entre
como Cliente e reserve a recompensa de 100 pontos: o total fica R$ 25,80 e o saldo continua
120 até aprovação. Simule recusa e falha, depois aprove: o saldo passa a 20. Conclua as
etapas com um perfil operacional; em Retirado, 25 pontos entram para o comprador, ficando
45. A tela de fidelidade mostra os movimentos. Tentar a recompensa de 300 pontos demonstra
saldo insuficiente.

`tests/beneficios.test.js` verifica valores, tetos, elegibilidade, não cumulatividade,
revalidação, integração com pagamento, saldo insuficiente, crédito na retirada e resgates
idempotentes. Execute todos os testes com `npm.cmd test` e compile com `npm.cmd run build`.

## Áreas operacionais

Entre em uma das contas fictícias e use o link da área correspondente no cabeçalho ou na
conta. Os dados são compartilhados entre os perfis durante a sessão, sem backend.

- **Atendente (`#/atendimento`)**: consulta todos os pedidos, com os prontos para retirada
  em primeiro lugar. Busca por número, filtro de status e filtro de unidade permitem
  localizar um pedido; produtos e quantidades ficam visíveis nos cards. A ação de retirada
  aparece somente em pedidos prontos. Não aparecem controles de preparo.
- **Cozinha (`#/cozinha`)**: fila apenas de pedidos Recebido/Em preparo, em ordem de chegada.
  Mostra unidade, número, horário, produtos e quantidades. Permite iniciar preparo e marcar
  como pronto, com filtro local de unidade e estado de fila vazia. Pedidos prontos saem
  da fila e ficam disponíveis para o atendimento; a cozinha não confirma retirada.
- **Gerente/Administrador (`#/gestao`)**: indicadores de pedidos por status, total líquido
  aprovado simulado, produtos cadastrados e campanhas disponíveis. O filtro do painel
  seleciona a unidade sem alterar a unidade do carrinho. A visão inclui consulta dos
  pedidos, catálogo com categoria/preço/disponibilidade e resumo das campanhas da rede.
  Valores incluem exemplos carregados e estão identificados como fictícios.

Abrir uma área de outro perfil mostra uma orientação para escolher o perfil na conta,
sem renderizar seus painéis ou controles. As ações também continuam validadas pelo serviço
de pedidos, mas isso é apenas uma regra demonstrativa de interface, sem segurança real.

O layout usa os componentes e a identidade visual existentes. Não foram encontrados
arquivos de wireframes na pasta. A tabela gerencial possui legenda, cabeçalhos e região
com rolagem horizontal acessível por teclado para caber em telas pequenas.

## Aviso e preferências de privacidade

Acesse `#/privacidade` pelo rodapé em qualquer tela, pelos formulários de acesso ou pela
área da conta. O aviso explica as finalidades, os dados fictícios, o que fica em memória,
o armazenamento local do carrinho e como limpar os dados da demonstração.

As opções **Comunicações promocionais demonstrativas** e **Estatísticas demonstrativas
de uso** começam desmarcadas. São independentes, opcionais e não ativam mensagens,
notificações, rastreadores ou transmissão de eventos. O protótipo apenas demonstra a
escolha; não coleta novos dados para implementar essas finalidades.

Marque as opções desejadas e use “Salvar preferências”. O formulário mostra a escolha
salva para consulta posterior. Alterações não salvas são descartadas ao sair da tela.
“Recusar todas as opções” salva ambas como desmarcadas e pode ser usado a qualquer momento
para revogar as escolhas. Recusa não bloqueia cadastro, navegação, checkout, acompanhamento,
promoções ou fidelidade. O funcionamento do carrinho é separado dessas preferências.

Preferências ficam só em memória, sem cookies ou novos registros no `localStorage`.
Recarregar a página, sair da conta, encerrar atendimento ou entrar/sair do canal Totem
restaura as opções desmarcadas. O Totem continua permitindo compra demonstrativa anônima.
Não há coleta adicional de CPF, endereço, telefone, localização ou dados reais de cartão.

Verificação: teste os três perfis, carregue exemplos e percorra preparo/retirada. Na gestão,
troque a unidade e confira pedidos/produtos/indicadores. Na privacidade, salve uma opção,
saia e volte para consultar, altere e recuse todas. Conclua um checkout com todas recusadas.
Teste Tab/Espaço nos checkboxes, toque, telas de 320px e a limpeza ao encerrar o Totem.
`tests/operacional-privacidade.test.js` cobre a fila, ordenação, filtros, indicadores e
validação das escolhas opcionais. Execute com `npm.cmd test`.
