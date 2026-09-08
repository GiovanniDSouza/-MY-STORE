import Link from "next/link";
import { prisma } from "../../src/lib/prisma";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const adminSections = [
  {
    title: "Produtos",
    description: "Gerencie os itens do catálogo, preços, imagens e cadastro.",
    href: "/admin/products",
    accent: "from-emerald-500/20 to-emerald-400/5",
  },
  {
    title: "Pedidos",
    description: "Acompanhe pedidos, confirme ou rejeite solicitações e veja pagamentos.",
    href: "/admin/orders",
    accent: "from-violet-500/20 to-violet-400/5",
  },
];

export default async function AdminHomePage() {
  const [productsCount, ordersCount, pendingOrdersCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "pending" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const totalRevenue = revenue._sum.total ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
            Administração
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Painel do lojista
          </h1>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Produtos</p>
            <p className="mt-4 text-3xl font-bold text-white">{productsCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pedidos</p>
            <p className="mt-4 text-3xl font-bold text-white">{ordersCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pendentes</p>
            <p className="mt-4 text-3xl font-bold text-amber-300">{pendingOrdersCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Faturamento</p>
            <p className="mt-4 text-2xl font-bold text-emerald-300">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className={`group block rounded-3xl border border-slate-800 bg-gradient-to-br ${section.accent} p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-slate-600`}
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                    Módulo
                  </p>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>

                <p className="max-w-md text-sm leading-6 text-slate-300">
                  {section.description}
                </p>

                <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition group-hover:border-slate-500">
                  Acessar painel →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
