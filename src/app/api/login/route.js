import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // extrai nome e senha do corpo da requisição
    // busca o usuário pelo nome
    // se não encontrar usuario ou a senha não bater, retorna erro 401
    return NextResponse.json({ usuario }); // se tudo certo, retorna os dados do usuário
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}