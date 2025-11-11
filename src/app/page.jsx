"use client";

import React from "react";
import axios from "axios";
import { Form, Input, Button, message, Alert } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

    const router = useRouter();
    const [erro, setErro] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const onFinish = async (valor) => {
      setCarregando(true);

      try{
        const {data} = await axios.post('/api/login', {
          nome: valor.nome,
          senha: valor.senha
        });

        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.push('/home');
        setCarregando(false);

      } catch (error) {
        setErro("Erro ao fazer login. Por favor, tente novamente.");
      } finally {
        setCarregando(false);
      }
    }

  return (
    <div>
      {
        erro && (
          <Alert
            message="Erro"
            type="error"
            description={erro}
            closable
            onClose={() => setErro(null)}
          />
        )
      }

      <Form name="login" onFinish={onFinish}>
        <Form.Item
          label="Nome"
          name="nome"
          rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="senha"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={carregando}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}