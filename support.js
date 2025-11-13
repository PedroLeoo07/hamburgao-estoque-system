// EDITE AQUI SOMENTE OS PACOTES QUE DESEJA INSTALAR NO PROJETO
const pacotes = [
  'antd@5.28.0',
  'axios@1.13.2',
  'bcryptjs@3.0.3',
  'dotenv@17.2.3',
  'prisma@6.19.0 --save-dev',
  '@prisma/client@6.19.0',
];

/*
 *
 * NÃO EDITE DAQUI PARA BAIXO
 *
 */
const apagar = {
  primeiro: ['inicial.js'],

  segundo: ['support.js', 'ultimo.js'],
};

const pacotesObrigatorios = [
  'react@19.2.0',
  'react-dom@19.2.0',
  'next@16.0.1',
  'babel-plugin-react-compiler@1.0.0 --save-dev',
];

const criarItens = {
  '.gitignore': {
    codigo: `# dependencies
/node_modules
/.pnp
.pnp.*

// testing
/coverage

// next.js
/.next/
/out/

// production
/build

// misc
.DS_Store
*.pem

// debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

// env files
.env*

// vercel
.vercel

// typescript
*.tsbuildinfo
next-env.d.ts`,
  },

  'jsconfig.json': {
    codigo: `{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/app/*"],
      "@api/*": ["./src/api/*"]
    }
  }
}`,
  },

  'next.config.mjs': {
    codigo: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;`,
  },

  'package.json': {
    codigo: `{
  "name": "NOME_DA_PASTA",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "cls && next dev",
    "build": "next build",
    "start": "next start"
  }
}`,
  },

  'README.md': {
    codigo: `This is a [Next.js](https://nextjs.org) project bootstrapped with [\`create-next-app\`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`app/page.js\`. The page auto-updates as you edit the file.

This project uses [\`next/font\`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

First steps and docs.`,
  },

  '.env': {
    codigo: `DATABASE_URL="postgresql://nomeUsuario:senha@localhost:porta/nomeBanco"`,
  },

  prisma: {
    'schema.prisma': {
      codigo: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id           Int            @id @default(autoincrement())
  nome         String         @unique
  senha        String
  movimentacao Movimentacao[]
}

model Lanche {
  id             Int            @id @default(autoincrement())
  nome           String
  estoque_minimo Int?           @default(0)
  movimentacao   Movimentacao[]
}

model Movimentacao {
  id         Int       @id @default(autoincrement())
  tipo       String
  quantidade Int
  data       DateTime? @default(now())
  usuarioId  Int
  lancheId   Int
  usuario    Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  lanche     Lanche?   @relation(fields: [lancheId], references: [id], onDelete: Cascade)
}`,
    },
    'seed.js': {
      codigo: `const { PrismaClient } = require('@prisma/client');
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
  });`,
    },
  },

  src: {
    app: {
      'page.jsx': {
        codigo: `export default function Page() {
  return (
    <div>
      <h1>Top demais !!!</h1>
    </div>
  );
}`,
      },
      'layout.jsx': {
        codigo: `import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}`,
      },
      'globals.css': {
        codigo: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
      },
      estoque: {
        'page.jsx': {
          codigo: `export default function Estoque() {
  return (
    <div>
      <h1>Aqui vão as Movimentações do Estoque</h1>
    </div>
  );
}`,
        },
      },
      home: {
        'page.jsx': {
          codigo: `export default function Home() {
  return (
    <div>
      <h1>Aqui vai a Home</h1>
    </div>
  );
}`,
        },
      },
      lanche: {
        'page.jsx': {
          codigo: `export default function Lanche() {
  return (
    <div>
      <h1>Aqui vão as informações dos Lanches</h1>
    </div>
  );
}`,
        },
      },
      api: {
        estoque: {
          'route.js': {
            codigo: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para calcular o estoque atual com base nas movimentações, seja de entrada ou saída
// Se o tipo for 'entrada', soma a quantidade; se for 'saída', subtrai a quantidade

export async function GET() {
  try {
    // busca todos os lanches com suas movimentações
    // mapeia os lanches para retornar apenas os campos necessários
    // calcula o estoque atual usando a função calcularEstoque
    return NextResponse.json(lanches); // retorna a lista de lanches com id, nome, estoque_minimo e estoque_atual
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // extrai os dados do corpo da requisição
    // busca o lanche pelo id com suas movimentações
    // se o lanche não existir, retorna erro 404
    // cria uma nova movimentação no banco de dados
    // calcula o estoque atual do lanche
    // verifica se deve gerar um alerta (saída e estoque abaixo do mínimo)
    return NextResponse.json({ sucesso: true, estoqueAtual, alerta }); // retorna sucesso, estoqueAtual e alerta se necessário
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao registrar movimentação' }, { status: 500 });
  }
}`,
          },
        },
        lanche: {
          'route.js': {
            codigo: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // busca todos os lanches
    return NextResponse.json(lanches); // retorna a lista de lanches
  } catch {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao buscar lanches' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // extrai os dados do corpo da requisição
    // cria um novo lanche no banco de dados
    return NextResponse.json(lanche); // retorna o lanche criado
  } catch {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao criar lanche' }, { status: 500 });
  }
}`,
          },
          '[id]': {
            'route.js': {
              codigo: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    // extrai o id dos parâmetros da rota
    // atualiza o lanche no banco de dados com os dados do corpo da requisição
    return NextResponse.json(lanche); // retorna o lanche atualizado
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao atualizar lanche' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // extrai o id dos parâmetros da rota
    // deleta o lanche do banco de dados
    return NextResponse.json({ sucesso: true }); // retorna sucesso
  } catch (error) {
    // se der erro, retorna erro 500 com mensagem apropriada
    return NextResponse.json({ erro: 'Erro ao deletar lanche' }, { status: 500 });
  }
}`,
            },
          },
        },
        login: {
          'route.js': {
            codigo: `import { NextResponse } from 'next/server';
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
}`,
          },
        },
      },
    },
  },
};

module.exports = {
  pacotesObrigatorios,
  pacotes,
  criarItens,
  apagar,
};
