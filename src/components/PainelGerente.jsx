import { useState } from 'react';
import { resumirOperacao } from '../services/operacionalService.js';
import { formatarMoeda } from '../utils/formatarMoeda.js';
import { etapasPedido } from '../data/pedidos.js';
import SeletorUnidadeOperacional from './SeletorUnidadeOperacional.jsx';
import PedidosPage from '../pages/PedidosPage.jsx';

export default function PainelGerente({ pedidos, ...props }) {
  const [unidadeId, setUnidadeId] = useState('todas');
  const resumo = resumirOperacao(pedidos, unidadeId);
  return <section className="painel-gerente" aria-labelledby="gerente-resumo-title"><h2 id="gerente-resumo-title">Visão resumida da operação</h2>
    <p>Dados fictícios desta sessão, incluindo exemplos carregados. Os valores não representam vendas reais.</p>
    <SeletorUnidadeOperacional value={unidadeId} onChange={setUnidadeId} />
    <dl className="indicadores-operacionais"><div><dt>Pedidos na seleção</dt><dd>{resumo.totalPedidos}</dd></div>{etapasPedido.map(etapa => <div key={etapa.id}><dt>{etapa.nome}</dt><dd>{resumo.porStatus[etapa.id]}</dd></div>)}<div><dt>Total aprovado simulado</dt><dd>{formatarMoeda(resumo.totalAprovadoCentavos / 100)}</dd></div><div><dt>Produtos cadastrados</dt><dd>{resumo.produtos.length}</dd></div><div><dt>Campanhas disponíveis na seleção</dt><dd>{resumo.campanhasDisponiveis}</dd></div></dl>
    <PedidosPage key={unidadeId} {...props} pedidos={resumo.pedidos} registroCompleto={pedidos} operacional mostrarFiltroUnidade={false} titulo="Pedidos da gestão" />
    <section className="painel" aria-labelledby="gestao-produtos-title"><h3 id="gestao-produtos-title">Produtos da seleção</h3>
      <div className="tabela-operacional" role="region" aria-label="Tabela de produtos, com rolagem horizontal" tabIndex={0}>
        <table><caption>Catálogo demonstrativo por unidade</caption><thead><tr><th scope="col">Produto</th><th scope="col">Unidade</th><th scope="col">Categoria</th><th scope="col">Preço</th><th scope="col">Disponibilidade</th></tr></thead><tbody>{resumo.produtos.map(produto => <tr key={produto.id}><th scope="row">{produto.nome}</th><td>{produto.unidadeNome}</td><td>{produto.categoria}</td><td>{formatarMoeda(produto.preco)}</td><td>{produto.disponivel ? 'Disponível' : 'Indisponível'}</td></tr>)}</tbody></table>
      </div>
    </section>
    <section aria-labelledby="gestao-campanhas-title"><h3 id="gestao-campanhas-title">Resumo das campanhas</h3><p>Campanhas de toda a rede. Confira a regra de unidade e o valor mínimo antes de aplicar.</p><div className="grid-beneficios">{resumo.campanhas.map(campanha => <article className="painel" key={campanha.codigo}><span className="perfil-etiqueta">{campanha.situacao}</span><h4>{campanha.nome}</h4><code>{campanha.codigo}</code><p>{campanha.descricao}</p></article>)}</div><a className="botao" href="#/promocoes">Consultar regras das promoções</a></section>
  </section>;
}
