import Link from "next/link";
import { ProductManagement } from "./ProductManagement";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Administração</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Produtos</h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <ProductManagement />
      </div>
    </main>
  );
}
