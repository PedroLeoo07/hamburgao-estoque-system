'use client';
import { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Select, 
  InputNumber, 
  DatePicker, 
  Alert,
  Space,
  Tag,
  message
} from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Estoque() {
  const router = useRouter();
  const [lanches, setLanches] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [form] = Form.useForm();

  const carregarDados = async () => {
    try {
      const { data } = await axios.get('/api/estoque');
      setLanches(data.lanches);
    } catch (error) {
      message.error('Erro ao carregar dados');
    }
  };

  // 7.1.2, 7.1.3: Registrar movimentação com data
  const registrarMovimentacao = async (values) => {
    const usuarioLogado = JSON.parse(
      sessionStorage.getItem('usuario')
    );
    
    try {
      const { data } = await axios.post('/api/estoque', {
        lanche_id: values.lanche_id,
        usuario_id: usuarioLogado.id,
        tipo: values.tipo,
        quantidade: values.quantidade,
        data_movimentacao: values.data_movimentacao.toISOString(),
      });
      
      // 7.1.4: Verificação automática e alerta
      if (data.alerta) {
        setAlerta(
          `⚠️ Atenção! Estoque do produto ficou abaixo do mínimo: ${data.estoqueAtual} unidades`
        );
      } else {
        setAlerta(null);
      }
      
      message.success('Movimentação registrada com sucesso!');
      form.resetFields();
      form.setFieldsValue({ data_movimentacao: dayjs() });
      carregarDados();
    } catch (error) {
      message.error('Erro ao registrar movimentação');
    }
  };

  useEffect(() => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (!usuarioLogado) {
      router.replace('/');
      return;
    }
    carregarDados();
  }, [router]);

  // 7.1.1: Listar produtos em ordem alfabética (algoritmo de ordenação)
  const lanchesOrdenados = [...lanches].sort((a, b) => {
    // Algoritmo: Bubble Sort adaptado / Sort nativo do JavaScript
    return a.nome.localeCompare(b.nome);
  });

  const colunas = [
    { 
      title: '🍔 Lanche', 
      dataIndex: 'nome', 
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome)
    },
    { 
      title: '📦 Estoque Atual', 
      dataIndex: 'estoque_atual', 
      key: 'estoque_atual',
      render: (valor, registro) => {
        const baixo = valor < registro.estoque_minimo;
        return (
          <Tag 
            color={baixo ? 'red' : 'green'} 
            style={{ fontSize: '15px', padding: '5px 10px' }}>
            {valor} {baixo ? '⚠️' : '✅'}
          </Tag>
        );
      },
      sorter: (a, b) => a.estoque_atual - b.estoque_atual
    },
    { 
      title: '📊 Estoque Mínimo', 
      dataIndex: 'estoque_minimo', 
      key: 'estoque_minimo',
      sorter: (a, b) => a.estoque_minimo - b.estoque_minimo
    },
    {
      title: '💰 Preço',
      dataIndex: 'preco',
      key: 'preco',
      render: (valor) => `R$ ${valor.toFixed(2)}`
    },
    {
      title: '📈 Status',
      key: 'status',
      render: (_, registro) => {
        const baixo = registro.estoque_atual < registro.estoque_minimo;
        return baixo ? (
          <Tag color="error">ESTOQUE BAIXO</Tag>
        ) : (
          <Tag color="success">OK</Tag>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />}
        size="large"
        onClick={() => router.push('/home')}
        style={{ marginBottom: '20px' }}>
        Voltar para Home
      </Button>

      <h1 style={{ marginBottom: '30px', fontSize: '2em' }}>
        📊 Gestão de Estoque
      </h1>

      {/* 7.1.4: Alerta de estoque baixo */}
      {alerta && (
        <Alert
          message={alerta}
          type="warning"
          closable
          onClose={() => setAlerta(null)}
          style={{ marginBottom: '30px', fontSize: '16px' }}
          showIcon
        />
      )}

      {/* Formulário de movimentação */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <h3>➕➖ Registrar Movimentação</h3>
        <Form 
          form={form} 
          layout="inline" 
          onFinish={registrarMovimentacao}
          initialValues={{ data_movimentacao: dayjs() }}
          style={{ marginTop: '20px' }}>
          
          {/* 7.1.2: Selecionar produto */}
          <Form.Item 
            name="lanche_id" 
            rules={[{ required: true, message: 'Selecione o lanche!' }]}>
            <Select 
              placeholder="🍔 Selecione o lanche" 
              style={{ width: 280 }}
              size="large"
              showSearch
              optionFilterProp="children">
              {lanchesOrdenados.map((l) => (
                <Select.Option key={l.id} value={l.id}>
                  {l.nome} (Atual: {l.estoque_atual})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          {/* 7.1.2: Escolher tipo de movimentação */}
          <Form.Item 
            name="tipo" 
            rules={[{ required: true, message: 'Selecione o tipo!' }]}>
            <Select placeholder="➕➖ Tipo" style={{ width: 160 }} size="large">
              <Select.Option value="entrada">➕ Entrada</Select.Option>
              <Select.Option value="saida">➖ Saída</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="quantidade" 
            rules={[
              { required: true, message: 'Digite a quantidade!' },
              { type: 'number', min: 1, message: 'Mínimo 1 unidade' }
            ]}>
            <InputNumber 
              placeholder="Quantidade" 
              min={1}
              style={{ width: 150 }}
              size="large"
            />
          </Form.Item>
          
          {/* 7.1.3: Inserir data da movimentação */}
          <Form.Item 
            name="data_movimentacao" 
            rules={[{ required: true, message: 'Selecione a data!' }]}>
            <DatePicker 
              placeholder="📅 Data" 
              format="DD/MM/YYYY"
              style={{ width: 160 }}
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              💾 Registrar
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* 7.1.1: Tabela de estoque em ordem alfabética */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>📦 Estoque Atual</h2>
        <Table
          columns={colunas}
          dataSource={lanchesOrdenados}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}