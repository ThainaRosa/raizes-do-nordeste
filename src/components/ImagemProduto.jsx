import { useState } from 'react';

function Imagem({ src, alt, prioridade }) {
  const [falhou, setFalhou] = useState(false);

  if (!src || falhou) {
    return (
      <div className="imagem-alternativa" role="img" aria-label={`Foto indisponível: ${alt}`}>
        <span aria-hidden="true">RN</span>
        <span>Feito com sabor e tradição</span>
        <small>Foto indisponível</small>
      </div>
    );
  }

  return <img src={src} alt={alt} loading={prioridade ? 'eager' : 'lazy'} onError={() => setFalhou(true)} />;
}

export default function ImagemProduto({ src, alt, prioridade = false, className = '' }) {
  return (
    <div className={`produto-foto ${className}`}>
      <Imagem key={src} src={src} alt={alt} prioridade={prioridade} />
    </div>
  );
}
