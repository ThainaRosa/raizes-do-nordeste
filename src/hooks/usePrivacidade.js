import { useState } from 'react';
import { preferenciasIniciais, validarPreferencias } from '../services/privacidadeService.js';

export default function usePrivacidade() {
  const [preferencias, setPreferencias] = useState(preferenciasIniciais);
  return {
    preferencias,
    salvar: dados => setPreferencias(validarPreferencias(dados)),
    limpar: () => setPreferencias(preferenciasIniciais()),
  };
}
