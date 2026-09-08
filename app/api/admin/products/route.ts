import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name: string;
      slug: string;
      category?: string;
      price: number;
      image?: string | null;
      description?: string | null;
    };

    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        category: body.category?.trim() || "Geral",
        price: Number(body.price),
        image: body.image ?? null,
        description: body.description ?? null,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Erro criando produto:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
