import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const status = String(formData.get("status") ?? "pending").toLowerCase();

    if (!/^(paid|canceled)$/.test(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status,
      },
    });

    return NextResponse.redirect(new URL("/admin/orders", request.url));
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o pedido." },
      { status: 500 },
    );
  }
}
