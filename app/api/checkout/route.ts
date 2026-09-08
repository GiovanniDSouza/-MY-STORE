import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customerName?: string;
      customerEmail?: string;
      address?: string;
      payment?: {
        method?: string;
        status?: string;
        installments?: number;
        installmentValue?: number;
      };
      items?: Array<{
        id: number;
        name: string;
        slug: string;
        image?: string;
        price: number;
        quantity: number;
      }>;
    };

    const customerName = body.customerName?.trim();
    const customerEmail = body.customerEmail?.trim();
    const address = body.address?.trim();
    const items = body.items ?? [];
    const paymentMethod = (body.payment?.method ?? "credit_card").toLowerCase();
    const paymentStatus = (body.payment?.status ?? "pending").toLowerCase();

    if (!customerName || !customerEmail || !address || items.length === 0) {
      return NextResponse.json(
        { error: "Dados do pedido incompletos." },
        { status: 400 },
      );
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const installmentCount = Number(body.payment?.installments ?? 1);
    const installmentValue = Number(
      body.payment?.installmentValue ??
        (Number.isFinite(total) && installmentCount > 0 ? total / installmentCount : total),
    );

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        address,
        total,
        paymentMethod,
        paymentStatus,
        installmentCount,
        installmentValue,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            productSlug: item.slug,
            productImage: item.image ?? null,
            unitPrice: Number(item.price),
            quantity: Number(item.quantity),
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Não foi possível concluir o pedido." },
      { status: 500 },
    );
  }
}
