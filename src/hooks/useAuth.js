import { useRef, useState } from 'react';
import { usuariosDemonstrativos } from '../data/usuarios.js';
import { autenticarUsuario, cadastrarUsuario, selecionarPerfil } from '../services/authService.js';

export default function useAuth() {
  // Registro e sessão somente em memória. Nenhum token, senha ou dado pessoal é persistido.
  const usuarios = useRef(usuariosDemonstrativos.map(usuario => ({ ...usuario })));
  const [usuario, setUsuario] = useState(null);

  function entrar(dados) {
    const autenticado = autenticarUsuario(usuarios.current, dados);
    setUsuario(autenticado);
  }

  function cadastrar(dados) {
    const novo = cadastrarUsuario(usuarios.current, dados);
    usuarios.current = [...usuarios.current, novo];
    setUsuario(novo);
  }

  function limparAtendimento() {
    setUsuario(null);
    usuarios.current = usuariosDemonstrativos.map(item => ({ ...item }));
  }

  return {
    usuario, entrar, cadastrar, sair: () => setUsuario(null), limparAtendimento,
    trocarPerfil: perfil => setUsuario(atual => selecionarPerfil(atual, perfil)),
  };
}
