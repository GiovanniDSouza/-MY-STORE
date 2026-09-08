"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  const categories = useMemo(
    () => ["Todas", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        category === "Todas" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

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
            <Link
              href="/produtos"
              className="text-sm text-gray-600 hover:text-black"
            >
              Produtos
            </Link>
            <Link
              href="/carrinho"
              className="text-sm text-gray-600 hover:text-black"
            >
              Carrinho
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Catálogo
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Todos os produtos
          </h1>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto..."
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black md:max-w-md"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-lg font-medium text-gray-700">
              Nenhum produto encontrado com essa busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link
                  href={`/produtos/${product.slug}`}
                  className="block overflow-hidden rounded-2xl bg-gray-100"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    unoptimized
                    className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </Link>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    {product.category}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold">
                      {formatPrice(product.price)}
                    </p>
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Ver mais
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
