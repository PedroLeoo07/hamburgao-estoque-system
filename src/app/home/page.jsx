'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (!usuarioLogado) {
      router.replace('/');
      return;
    }
    setUsuario(JSON.parse(usuarioLogado));
  }, [router]);

  const sair = () => {
    sessionStorage.removeItem('usuario');
    router.replace('/');
  };

  return (
    <div>
      {usuario ? (
        <div>
          <h1>Bem-vindo, {usuario.nome}</h1>
          <Button onClick={() => router.replace('/lanche')}>Lanches</Button>
          <Button onClick={() => router.replace('/estoque')}>Estoque</Button>
          <Button danger onClick={sair}>
            Sair
          </Button>
        </div>
      ) : (
        <p>Carregando ...</p>
      )}
    </div>
  );
}