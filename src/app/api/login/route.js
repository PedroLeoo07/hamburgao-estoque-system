import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { nome, senha } = await request.json();

        const usuario = await prisma.usuario.findUnique({
            where: { nome: nome },
        });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                sucesso: true,
                usuario: { id: usuario.id, nome: usuario.nome }
            }
        );

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 404 }
        );
    }
}