const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
console.log('');
console.log('');
  console.log('🌱 Iniciando seed...');

  await prisma.movimentacao.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.lanche.deleteMany();

  console.log('🧹 Dados antigos removidos.');

  const usuarios = await prisma.usuario.createMany({
    data: [
      { nome: 'admin', senha: bcrypt.hashSync('123', 10) },
    ],
  });

  console.log('👤 Usuários criados.');

  const lanches = await prisma.lanche.createMany({
    data: [
      { nome: 'X-Salada', estoque_minimo: 10 },
    ],
  });

  console.log('🍔 Lanches criados.');

}

main()
  .then(() => console.log('✅ Seed concluído com sucesso!'))
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });