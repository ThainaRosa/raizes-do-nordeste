# Revisão funcional — Raízes do Nordeste

Revisão realizada em 24/10/2026. Escopo: requisitos demonstrativos de Front-End presentes
no projeto. Não é auditoria de segurança, certificação de acessibilidade ou parecer de LGPD.

## Resultado e ambiente

- Node.js **v24.22.1** e npm **11.19.1**; scripts executados pelo
  `npm.cmd` no PowerShell para evitar o bloqueio de `npm.ps1`.
- `npm.cmd test`: **44 testes passaram, zero falhas**.
- `npm.cmd run build`: **aprovado**, Vite compilou 95 módulos.
- `npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort`: versão compilada
  servida em `http://127.0.0.1:4173` e utilizada nos testes de navegador desta revisão.
- Navegador efetivamente usado: Microsoft Edge/Chromium em modo headless, com Playwright
  instalado fora do projeto. Mouse, teclado e toque emulado. Nenhuma dependência adicionada
  ao `package.json`.
- Dimensões verificadas no roteiro de regressão: 320, 390, 768, 850 e 1280 px de largura,
  altura de 900 px, em cada modo Mobile, Web e Totem.

## Problemas reproduzidos e corrigidos

1. **Edição da quantidade seguida de clique em +/−.** Digitar 5 e clicar em + mantinha 5.
   O blur do campo atualizava o carrinho e inseria o feedback entre pressionar e soltar o
   mouse, interceptando o clique. A confirmação agora ocorre ao sair do grupo de controles;
   os botões operam sobre o valor válido digitado. Verificado: 5 + resulta em 6/R$ 113,40;
   5 − por toque resulta em 4; sair do grupo com Tab confirma a edição. Limites 1–99 e
   rejeição de zero, negativo, fracionário, vazio e 100 continuam funcionando.
2. **Filtros de unidade conflitantes na gestão.** Selecionar Centro no filtro interno e
   Shopping no filtro do painel mostrava um pedido no indicador e nenhum card. O painel
   agora usa um único filtro de unidade; os filtros de consulta são reiniciados ao trocar
   a seleção. Verificado com os exemplos: Shopping exibe um pedido e um produto.
3. **Orientação na navegação.** Links para telas longas podiam deixar o usuário na posição
   anterior de rolagem e sem foco no conteúdo novo. A navegação agora foca o primeiro título
   do conteúdo e retorna ao início. Verificado por link do rodapé, links internos e histórico
   voltar/avançar, nos três modos.

## Matriz de verificação efetivamente executada

| Módulo | Verificações | Resultado |
| --- | --- | --- |
| Navegação | Cardápio, carrinho, checkout, consulta, detalhes, pedido ausente, promoções, fidelidade, conta, login, cadastro, privacidade, página desconhecida e quatro áreas de perfil; voltar/avançar, foco e rolagem | Passou |
| Responsividade | As telas acima em cinco larguras nos três modos; gestão com dados, tabela com rolagem interna e fila no Totem em 320 px | Passou nas dimensões verificadas |
| Unidade/cardápio | Centro com três produtos, Shopping com baião; troca com carrinho exige confirmação; cancelar preserva dados, confirmar limpa | Passou |
| Busca/filtros | Busca sem acento/maiúsculas, categoria combinada, resultado vazio, limpar filtros, consulta por número/status/unidade | Passou |
| Imagens | Quatro arquivos locais respondendo como JPEG; bloqueio de tapioca produz alternativa visual, sem quebrar o card | Passou |
| Disponibilidade | Mock temporariamente indisponível injetado somente no navegador em desenvolvimento; quantidade e adição bloqueadas; nenhuma alteração persistente no mock | Passou |
| Carrinho | Adição, remoção, quantidade direta e botões, limites, valores em reais, persistência após recarga, estado vazio e checkout bloqueado | Passou |
| Checkout | Revisão/confirmar, método obrigatório, processamento, aprovação/recusa/falha, tentativa posterior, bloqueio do canal e eventos de envio duplicados | Passou; um pedido após aprovação |
| Acesso | Obrigatórios, e-mail inválido, duplicidade, cadastro válido, código incorreto, login posterior, logout, quatro contas, seleção de perfil, sessão encerrada por recarga | Passou |
| Pedidos | Exemplos, pedido não encontrado, fila de evolução, orientações de retirada, integração com checkout e preservação de pedidos ao alternar perfis | Passou |
| Status | Serviço rejeita retrocesso, salto, repetição, estado esperado antigo e perfil incompatível; interface oculta ações incompatíveis | Passou |
| Promoções | Cupom inexistente/vencido, regras de mínimo/unidade/perfil, SABOR10 sobre R$ 37,80 resulta em R$ 34,02, revalidação após edição, benefício único | Passou |
| Recompensas | Saldo insuficiente, reserva sem débito, recusa/falha preservam saldo, aprovação debita uma vez, descontos mantidos no pedido | Passou |
| Pontos | Recompensa de 100 pontos deixa 120 até aprovar, depois 20; pedido líquido de R$ 25,80 gera 25 pontos na retirada para o titular, saldo 45 | Passou |
| Operação | Atendente confirma retirada; Cozinha inicia/conclui preparo em fila FIFO; Gerente consulta indicadores, produtos e campanhas por seleção | Passou |
| Privacidade | Opções inicialmente desmarcadas, salvar/consultar/alterar/revogar, rascunho não salvo descartado, teclado/Espaço/toque e checkout com todas recusadas | Passou |
| Totem | Atendimento anônimo, limpeza de login/cadastros/pedidos/benefícios/pontos/preferências ao encerrar ou sair do canal | Passou |
| Recuperação | localStorage bloqueado mantém carrinho em memória; JSON inválido testado no serviço; erro de imagem tratado; recusa/falha permitem nova tentativa | Passou |

O roteiro de navegador verifica reflow, ausência de transbordamento horizontal da página,
presença e operação de controles. Não substitui avaliação visual humana de cada combinação
de tela, conteúdo e zoom, nem testes com tecnologia assistiva real.

## Independência de backend e pagamentos reais

A inspeção de `src`, `public` e `index.html` não encontrou clientes HTTP, URLs de backend,
WebSocket de aplicação ou SDK de pagamento. Os serviços consultam os mocks e a simulação
usa Promise/temporizador local. O roteiro monitorou requisições HTTP nos contextos principais
e terminou sem requisições externas ou erros JavaScript nesses contextos.

Não são solicitados número de cartão, CVV, senha bancária, QR Code Pix real ou transferência.
O código público `RAIZES-DEMO` não é uma senha de produção. A persistência grava apenas
canal/unidade/IDs e quantidades do carrinho. Sessão, consentimentos, pedidos, benefícios e
movimentos de pontos permanecem em memória. As quatro imagens vêm de `public/images`.

## Arquivos alterados nesta revisão

- `src/components/QuantidadeControle.jsx`: correção da edição seguida dos botões.
- `src/routes/Navegacao.jsx`: foco e rolagem por mudança de rota.
- `src/components/PainelGerente.jsx`: filtro único e reinicialização da consulta.
- `src/pages/PedidosPage.jsx`: opção de ocultar o filtro interno de unidade na gestão.
- `scripts/revisao-navegador.cjs`: novo roteiro de regressão repetível, com ferramenta externa opcional.
- `REVISAO.md`: este relatório.
- `README.md`: acesso ao relatório e ao roteiro.

`dist/` foi regenerada por `npm.cmd run build`, sem edição manual dos arquivos compilados.
Os arquivos de dados mockados e as dependências do projeto foram preservados.

## Reprodução dos comandos

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

O roteiro opcional usa Playwright externo, sem incluí-lo nas dependências do aplicativo.
Nesta máquina ele está em uma pasta temporária de ferramentas. Em outro terminal:

```powershell
$env:PLAYWRIGHT_MODULE = Join-Path $env:TEMP 'raizes-browser-check/node_modules/playwright'
node scripts/revisao-navegador.cjs
```

Para preparar a ferramenta em outra máquina, opcionalmente:

```powershell
npm.cmd install --prefix "$env:TEMP/raizes-browser-check" --no-package-lock --no-audit --no-fund playwright
```

O roteiro usa Edge instalado por padrão. `REVIEW_BROWSER_EXECUTABLE` permite informar outro
executável Chromium; `REVIEW_BASE_URL` altera a URL alvo. Sem essas opções, usa o Edge e a
porta 4173. O roteiro cobre rotas, larguras, correções desta revisão, catálogo, carrinho,
pagamentos, imagens e armazenamento bloqueado.

Também foram reexecutados nesta revisão roteiros temporários de cadastro/login, benefícios,
operação/privacidade, limpeza do Totem e disponibilidade. Esses cenários estão descritos na
matriz; não foram todos incorporados ao script permanente. Na primeira execução do novo
roteiro, o teste de imagem ausente expirou por não rolar até uma imagem com lazy loading.
O roteiro foi corrigido para tornar o card visível, reexecutado por inteiro e passou.

## Limitações e verificações pendentes

- Não identifiquei requisito demonstrativo sem implementação entre os módulos revisados;
  isso não prova ausência de defeitos fora dos cenários executados.
- Não testados em Firefox, Safari, dispositivos físicos ou terminais Totem reais. Toque
  foi emulado no Edge. Não houve teste com leitor de tela, impressão ou auditoria completa
  de contraste, zoom e acessibilidade.
- Não foi feita auditoria de segurança, de dependências ou de conformidade legal.
  O projeto não oferece autenticação/controle de acesso de produção nem conformidade LGPD
  integral por possuir essas telas. Não há backend, cobrança ou envio real de mensagens.
- Não há scripts de lint ou typecheck no `package.json`; não foram declarados executados.
- Pedidos, cadastro novo, pontos e preferências são temporários por projeto. Não existe
  sincronização entre abas, histórico persistente de pedidos ou atualização em tempo real
  entre aparelhos. Esses recursos não foram implementados nem testados como funcionalidades.
- Não foram encontrados wireframes externos na pasta para comparação visual independente.

## Roteiro manual recomendado

1. Execute `npm.cmd run dev` e abra o endereço exibido pelo Vite.
2. Alterne Mobile/Web/Totem e teste 320 px e tela ampla. Navegue pelo rodapé e pelo cabeçalho;
   confirme início da tela, foco no título, voltar/avançar e acesso à página desconhecida.
3. No Centro, procure `CAJA`, combine com Pratos e limpe. Troque para Shopping e confira
   baião e foto. Abra detalhes com Enter e feche com Esc; confirme retorno do foco.
4. Adicione tapioca. No carrinho, digite 5 e clique +: espere 6 e R$ 113,40. Teste −, Tab,
   zero, fração e limite 99. Remova o item e confira bloqueio do checkout vazio.
5. Com duas tapiocas, teste cupom inexistente, VOLTE5 e SABOR10. Espere R$ 34,02; reduzir
   para uma deve bloquear o checkout até ajustar ou remover o benefício.
6. Entre pela conta Cliente (`cliente@raizes.example`, código `RAIZES-DEMO`). Reserve a
   recompensa de 100 pontos. Teste recusa e falha no checkout, depois aprovação. Espere
   carrinho vazio, ID fictício e saldo de 20 pontos após o desconto de R$ 12,00.
7. Abra o acompanhamento. Pela conta, alterne os perfis operacionais para preparar e
   retirar o pedido. Retirado deve creditar os pontos uma vez; exemplos não pontuam.
8. Confira a fila da Cozinha, confirmação de retirada do Atendente e indicadores/tabela/
   campanhas do Gerente. Alterne a unidade da gestão e confira os filtros reiniciados.
9. No aviso de privacidade, consulte finalidades, salve uma escolha, volte, altere e
   recuse tudo. Confirme que checkout continua disponível. Use Tab e Espaço nos controles.
10. No Totem, encerre o atendimento e confira que conta, pedidos, preferências e benefícios
    anteriores desapareceram. Em Mobile/Web, recarregue para conferir o carrinho restaurado
    e as outras informações temporárias reiniciadas.
