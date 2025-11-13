import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calcularEstoque = (movimentacoes) =>
  movimentacoes.reduce(
    (total, m) => total + (m.tipo === 'entrada' ? m.quantidade : -m.quantidade),
    0,
  );

export async function GET() {
  try {
    const lanches = await prisma.lanche.findMany({ include: { movimentacao: true } });
    return NextResponse.json({
      lanches: lanches.map((l) => ({
        id: l.id,
        nome: l.nome,
        estoque_minimo: l.estoque_minimo,
        estoque_atual: calcularEstoque(l.movimentacao),
      })),
    });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { lanche_id, usuario_id, tipo, quantidade, data_movimentacao } = await request.json();
    const lanche = await prisma.lanche.findUnique({
      where: { id: parseInt(lanche_id) },
      include: { movimentacao: true },
    });

    await prisma.movimentacao.create({
      data: {
        lancheId: parseInt(lanche_id),
        usuarioId: parseInt(usuario_id),
        tipo,
        quantidade: parseInt(quantidade),
        ...(data_movimentacao && { data: new Date(data_movimentacao) }),
      },
    });

    const estoqueAtual =
      calcularEstoque(lanche.movimentacao) +
      (tipo === 'entrada' ? parseInt(quantidade) : -parseInt(quantidade));
    const alerta = tipo === 'saida' && estoqueAtual < lanche.estoque_minimo;

    return NextResponse.json({ sucesso: true, estoqueAtual, alerta });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao registrar movimentação' }, { status: 500 });
  }
}