import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lanches = await prisma.lanche.findMany();
    return NextResponse.json(lanches);
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar lanches' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nome, preco, estoque_minimo } = await request.json();
    const lanche = await prisma.lanche.create({
      data: { 
        nome, 
        preco: preco ? parseFloat(preco) : null,
        estoque_minimo: parseInt(estoque_minimo) 
      },
    });
    return NextResponse.json(lanche);
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar lanche' }, { status: 500 });
  }
}