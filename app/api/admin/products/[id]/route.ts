import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }

    const body = (await request.json()) as {
      name?: string;
      slug?: string;
      category?: string;
      price?: number;
      image?: string | null;
      description?: string | null;
    };

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name?.trim() || undefined,
        slug: body.slug?.trim() || undefined,
        category: body.category?.trim() || undefined,
        price: body.price !== undefined ? Number(body.price) : undefined,
        image: body.image ?? undefined,
        description: body.description ?? undefined,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o produto." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o produto." },
      { status: 500 },
    );
  }
}
