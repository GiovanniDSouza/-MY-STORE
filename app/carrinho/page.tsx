"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCart,
  getCartItems,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from "../../src/lib/cart";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadItems = () => setItems(getCartItems());
    loadItems();

    const handleCartUpdate = () => loadItems();
    window.addEventListener("cart:updated", handleCartUpdate);

    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (productId: number) => {
    setItems(removeFromCart(productId));
  };

  const handleClearCart = () => {
    setItems(clearCart());
  };

  const handleQuantityChange = (productId: number, nextQuantity: number) => {
    setItems(updateQuantity(productId, nextQuantity));
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Minha Loja
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-gray-600 hover:text-black">
              Início
            </Link>
            <Link href="/produtos" className="text-sm text-gray-600 hover:text-black">
              Produtos
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Carrinho</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-lg font-medium text-gray-700">Seu carrinho está vazio.</p>
                <Link href="/produtos" className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  Ver produtos
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-gray-300">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="min-w-24 text-right font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold">Resumo do pedido</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <label htmlFor="coupon" className="mb-2 block text-sm font-medium text-gray-700">
                  Cupom de desconto
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    placeholder="Digite o código"
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                  />
                  <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                    Aplicar
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="flex justify-between">
                  <span>Desconto</span>
                  <span>- R$ 0,00</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-black">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/produtos"
                className="rounded-full border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-900 hover:bg-gray-100"
              >
                Continuar comprando
              </Link>

              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-full border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-600 hover:bg-red-100"
              >
                Limpar carrinho
              </button>

              <Link
                href="/checkout"
                className="block w-full rounded-full bg-black px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                Finalizar compra
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
