import Link from "next/link";
import type { ReactNode } from "react";

const items = [
  { label: "Painel", href: "/admin" },
  { label: "Produtos", href: "/admin/products" },
  { label: "Pedidos", href: "/admin/orders" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl gap-6 px-4 py-6 lg:flex lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              Minha Loja
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">Admin</h2>
          </div>

          <nav className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:text-white"
              >
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Ver loja
            </Link>
          </div>
        </aside>

        <div className="flex-1">
          <nav className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}
