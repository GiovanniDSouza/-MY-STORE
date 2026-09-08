"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearCart, getCartItems, type CartItem } from "../../src/lib/cart";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "cash" | "pix">("credit_card");
  const [installments, setInstallments] = useState("1");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  const installmentCount = Number(installments || 1);
  const installmentValue = total / installmentCount;

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          address,
          payment: {
            method: paymentMethod,
            status: "pending",
            installments: paymentMethod === "cash" || paymentMethod === "pix" ? 1 : installmentCount,
            installmentValue:
              paymentMethod === "cash" || paymentMethod === "pix"
                ? total
                : installmentValue,
          },
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível concluir o pedido.");
      }

      clearCart();
      router.push(`/checkout/sucesso?orderId=${data.orderId}`);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao finalizar o pedido. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <p className="text-lg font-semibold">Seu carrinho está vazio.</p>
          <Link
            href="/produtos"
            className="mt-6 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Explorar produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Minha Loja
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Finalizar compra
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Dados do pedido</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                id="name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                Endereço de entrega
              </label>
              <textarea
                id="address"
                rows={4}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Rua, número, bairro, cidade, CEP"
                required
              />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Pagamento</h2>
                <span className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
                  {paymentMethod === "credit_card"
                    ? "Cartão"
                    : paymentMethod === "debit_card"
                      ? "Débito"
                      : paymentMethod === "pix"
                        ? "Pix"
                        : "Dinheiro"}
                </span>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { value: "credit_card", label: "Cartão" },
                  { value: "debit_card", label: "Débito" },
                  { value: "pix", label: "Pix" },
                  { value: "cash", label: "Dinheiro" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentMethod(option.value as typeof paymentMethod)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                      paymentMethod === option.value
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "credit_card" || paymentMethod === "debit_card" ? (
                <>
                  <div
                    className="relative mx-auto h-56 w-full max-w-md cursor-pointer"
                    onClick={() => setCardSide((current) => (current === "front" ? "back" : "front"))}
                    style={{ perspective: "1200px" }}
                  >
                    <div
                      className="relative h-full w-full rounded-[28px] transition-transform duration-500"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: cardSide === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[28px] border border-black/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-2xl"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-white/20" />
                              <div className="h-7 w-16 rounded-md bg-white/10" />
                            </div>
                            <span className="text-xs uppercase tracking-[0.25em] text-slate-300">
                              Visa
                            </span>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                              Número do cartão
                            </p>
                            <p className="mt-3 text-xl tracking-[0.25em]">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </p>
                          </div>

                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                                Nome
                              </p>
                              <p className="mt-1 text-sm uppercase tracking-[0.15em]">
                                {cardName || "SEU NOME"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">
                                Validade
                              </p>
                              <p className="mt-1 text-sm tracking-[0.15em]">
                                {cardExpiry || "MM/AA"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 rounded-[28px] border border-black/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-2xl"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <div className="flex h-full flex-col justify-between">
                          <div className="mt-5 h-12 w-full bg-black/70" />
                          <div className="flex items-center justify-end">
                            <div className="rounded-md bg-white px-3 py-2 text-right text-sm text-gray-900">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                                CVV
                              </span>
                              <div className="mt-1 font-bold tracking-[0.2em]">
                                {cardCvv || "•••"}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                            Assinatura digital
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {cardSide === "front" ? (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Número do cartão
                          </label>
                          <input
                            value={cardNumber}
                            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            placeholder="1234 5678 9012 3456"
                            inputMode="numeric"
                            required
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Nome no cartão
                            </label>
                            <input
                              value={cardName}
                              onChange={(event) => setCardName(event.target.value.toUpperCase())}
                              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                              placeholder="NOME DO TITULAR"
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Validade
                            </label>
                            <input
                              value={cardExpiry}
                              onChange={(event) => setCardExpiry(formatExpiry(event.target.value))}
                              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                              placeholder="MM/AA"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCardSide("back")}
                          className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:border-black"
                        >
                          Continuar para o verso do cartão
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Código de segurança (CVV)
                          </label>
                          <input
                            value={cardCvv}
                            onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            placeholder="123"
                            inputMode="numeric"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Parcelamento
                          </label>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {Array.from({ length: 12 }, (_, index) => index + 1).map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setInstallments(String(option))}
                                className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                                  Number(installments) === option
                                    ? "border-black bg-black text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-black"
                                }`}
                              >
                                {option}x
                              </button>
                            ))}
                          </div>

                          <div className="mt-3 rounded-2xl bg-gray-100 p-3 text-sm text-gray-700">
                            <div className="flex items-center justify-between">
                              <span>Parcelas sem juros</span>
                              <span className="font-semibold text-gray-900">{installments}x</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span>Valor por parcela</span>
                              <span className="font-semibold text-gray-900">
                                {formatPrice(installmentValue)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setCardSide("front")}
                            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-900 transition hover:border-black"
                          >
                            Voltar para frente
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">
                    {paymentMethod === "pix" ? "Pagamento via Pix" : "Pagamento em dinheiro"}
                  </p>
                  <p className="mt-2">
                    {paymentMethod === "pix"
                      ? "O cliente pode pagar com chave Pix após a confirmação do pedido."
                      : "O cliente pode pagar presencialmente na entrega ou no recebimento da compra."}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Processando..." : "Confirmar pedido"}
            </button>
          </form>

          <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold">Resumo</h2>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x • {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
