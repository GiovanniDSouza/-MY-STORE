import Link from "next/link";
import { prisma } from "../../../src/lib/prisma";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const paymentLabel = {
  credit_card: "Cartão",
  cash: "Dinheiro",
  pix: "Pix",
  debit_card: "Débito",
};

const statusLabel = {
  pending: "Pendente",
  paid: "Pago",
  canceled: "Cancelado",
  refunded: "Estornado",
};

export default async function Page() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              Administração
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Pedidos</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              ← Voltar ao painel
            </Link>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              {orders.length} pedido{orders.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-12 text-center text-slate-300">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const paymentMethod = paymentLabel[order.paymentMethod as keyof typeof paymentLabel] ?? "Cartão";
              const paymentStatus = statusLabel[order.paymentStatus as keyof typeof statusLabel] ?? "Pendente";
              const installmentValue = order.installmentValue > 0 ? order.installmentValue : order.total / Math.max(order.installmentCount, 1);

              return (
                <article
                  key={order.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20"
                >
                  <div className="flex flex-col gap-5 border-b border-slate-800 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Pedido #{order.id}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{order.customerName}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                        {paymentStatus}
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300">
                        {paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Cliente</p>
                          <p className="mt-2 font-medium text-white">{order.customerEmail}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Entrega</p>
                          <p className="mt-2 font-medium text-white">{order.address}</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-slate-500">Itens</p>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                            >
                              <div>
                                <p className="font-medium text-white">{item.productName}</p>
                                <p className="text-sm text-slate-400">
                                  {item.quantity}x • {formatCurrency(item.unitPrice)} cada
                                </p>
                              </div>
                              <span className="font-semibold text-slate-200">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Resumo do pagamento</p>

                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Total</span>
                          <span className="text-lg font-semibold text-white">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Forma</span>
                          <span>{paymentMethod}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Parcelas</span>
                          <span>{order.installmentCount}x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Valor da parcela</span>
                          <span>{formatCurrency(installmentValue)}</span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status do pagamento</p>
                        <p className="mt-2 font-medium text-white">{paymentStatus}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <form action={`/api/admin/orders/${order.id}`} method="post">
                          <input type="hidden" name="status" value="paid" />
                          <button
                            type="submit"
                            className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                          >
                            Confirmar pedido
                          </button>
                        </form>

                        <form action={`/api/admin/orders/${order.id}`} method="post">
                          <input type="hidden" name="status" value="canceled" />
                          <button
                            type="submit"
                            className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Rejeitar pedido
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
