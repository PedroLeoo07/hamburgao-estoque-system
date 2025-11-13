'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Form, Input, InputNumber, Space, message } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Lanches() {
  const router = useRouter();
  const [lanches, setLanches] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [form] = Form.useForm();

  // 6.1.1: Carregar dados automaticamente
  const carregarLanches = async () => {
    try {
      const { data } = await axios.get('/api/lanche');
      setLanches(data);
    } catch (error) {
      message.error('Erro ao carregar lanches');
    }
  };

  // 6.1.3: Inserir novo produto
  // 6.1.4: Editar produto existente
  const salvarLanche = async (values) => {
    // 6.1.6: Validação dos dados (o Form do antd já faz validação)
    try {
      if (editandoId) {
        await axios.put(`/api/lanche/${editandoId}`, values);
        message.success('Lanche atualizado com sucesso!');
      } else {
        await axios.post('/api/lanche', values);
        message.success('Lanche cadastrado com sucesso!');
      }
      form.resetFields();
      setEditandoId(null);
      carregarLanches();
    } catch (error) {
      message.error('Erro ao salvar lanche');
    }
  };

  // 6.1.5: Excluir produto existente
  const removerLanche = async (id) => {
    if (confirm('Tem certeza que deseja remover este lanche?')) {
      try {
        await axios.delete(`/api/lanche/${id}`);
        message.success('Lanche removido com sucesso!');
        carregarLanches();
      } catch (error) {
        message.error('Erro ao remover lanche');
      }
    }
  };

  const editar = (lanche) => {
    setEditandoId(lanche.id);
    form.setFieldsValue(lanche);
  };

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (!usuarioLogado) {
      router.replace('/');
      return;
    }
    carregarLanches();
  }, [router]);

  const colunas = [
    { 
      title: '🍔 Nome', 
      dataIndex: 'nome', 
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome)
    },
    { 
      title: '💰 Preço', 
      dataIndex: 'preco', 
      key: 'preco', 
      render: (valor) => valor != null ? `R$ ${valor.toFixed(2)}` : 'R$ 0,00',
      sorter: (a, b) => (a.preco || 0) - (b.preco || 0)
    },
    { 
      title: '📦 Estoque Mínimo', 
      dataIndex: 'estoque_minimo', 
      key: 'estoque_minimo',
      sorter: (a, b) => a.estoque_minimo - b.estoque_minimo
    },
    {
      title: '⚙️ Ações',
      key: 'acoes',
      render: (_, lanche) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => editar(lanche)}>
            ✏️ Editar
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => removerLanche(lanche.id)}>
            🗑️ Apagar
          </Button>
        </Space>
      ),
    },
  ];

  // 6.1.2: Campo de busca que atualiza a listagem
  const lanchesFiltrados = lanches.filter((l) => 
    l.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 6.1.7: Retornar à interface principal */}
      <Button 
        icon={<ArrowLeftOutlined />}
        size="large"
        onClick={() => router.push('/home')}
        style={{ marginBottom: '20px' }}>
        Voltar para Home
      </Button>

      <h1 style={{ marginBottom: '30px', fontSize: '2em' }}>
        🍔 Cadastro de Produtos
      </h1>

      {/* Formulário de cadastro/edição */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <h3>{editandoId ? '✏️ Editando Lanche' : '➕ Novo Lanche'}</h3>
        <Form 
          form={form} 
          layout="inline" 
          onFinish={salvarLanche}
          style={{ marginTop: '20px' }}>
          <Form.Item 
            name="nome" 
            rules={[
              { required: true, message: 'Digite o nome!' },
              { min: 3, message: 'Nome deve ter no mínimo 3 caracteres' }
            ]}>
            <Input 
              placeholder="Nome do lanche" 
              style={{ width: '220px' }}
              size="large"
            />
          </Form.Item>
          
          <Form.Item 
            name="preco" 
            rules={[
              { required: true, message: 'Digite o preço!' },
              { type: 'number', min: 0.01, message: 'Preço deve ser maior que zero' }
            ]}>
            <InputNumber 
              placeholder="Preço" 
              min={0}
              step={0.01}
              prefix="R$"
              style={{ width: '150px' }}
              size="large"
            />
          </Form.Item>
          
          <Form.Item 
            name="estoque_minimo" 
            rules={[
              { required: true, message: 'Digite o estoque mínimo!' },
              { type: 'number', min: 0, message: 'Deve ser maior ou igual a zero' }
            ]}>
            <InputNumber 
              placeholder="Estoque Mínimo" 
              min={0} 
              style={{ width: '180px' }}
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editandoId ? '💾 Salvar' : '➕ Adicionar'}
              </Button>
              {editandoId && (
                <Button size="large" onClick={() => {
                  form.resetFields();
                  setEditandoId(null);
                }}>
                  ❌ Cancelar
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* Campo de busca */}
      <div style={{ marginBottom: '20px' }}>
        <Input
          placeholder="🔍 Buscar lanche pelo nome..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* 6.1.1: Tabela com dados carregados automaticamente */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <Table
          columns={colunas}
          dataSource={lanchesFiltrados}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}