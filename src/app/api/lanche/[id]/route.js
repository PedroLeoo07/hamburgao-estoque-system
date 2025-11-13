import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nome, preco, estoque_minimo } = await request.json();
    const lanche = await prisma.lanche.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        preco: preco ? parseFloat(preco) : null,
        estoque_minimo: parseInt(estoque_minimo)
      },
    });
    return NextResponse.json(lanche);
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao atualizar lanche' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.lanche.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao deletar lanche' }, { status: 500 });
  }
}