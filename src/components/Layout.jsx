import Cabecalho from './Cabecalho.jsx';
import Rodape from './Rodape.jsx';

export default function Layout({ modo, onChangeModo, quantidadeCarrinho, onEncerrar, processando, temPedido, usuario, onSair, children }) {
  return (
    <div className={`app modo-${modo}`}>
      <Cabecalho modo={modo} onChangeModo={onChangeModo} quantidadeCarrinho={quantidadeCarrinho} onEncerrar={onEncerrar} processando={processando} temPedido={temPedido} usuario={usuario} onSair={onSair} />
      <main className="conteudo">{children}</main>
      <Rodape />
    </div>
  );
}
