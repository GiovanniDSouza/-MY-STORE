"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-20 text-gray-900">
      <div className="max-w-lg rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
          Pedido confirmado
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Obrigado pela compra!</h1>
        <p className="mt-4 text-gray-600">
          Seu pedido foi registrado com sucesso.
        </p>

        {orderId ? (
          <p className="mt-3 text-sm text-gray-600">
            Código do pedido: <span className="font-semibold text-black">#{orderId}</span>
          </p>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-white px-6 py-20 text-gray-900">
        <div className="max-w-lg rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm">
          <p className="text-lg font-semibold">Confirmando seu pedido...</p>
        </div>
      </main>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
