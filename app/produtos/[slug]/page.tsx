import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "../../../src/components/AddToCartButton";
import { formatPrice, getProductBySlug, getCatalogProducts } from "../../../src/data/products";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

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
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            {product.category}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold text-black">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 text-lg text-gray-600">{product.description}</p>

          <div className="mt-8 flex gap-4">
            <AddToCartButton product={product} />
            <Link
              href="/produtos"
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100"
            >
              Voltar
            </Link>
          </div>

          <div className="mt-4">
            <Link
              href="/carrinho"
              className="text-sm font-medium text-gray-700 underline decoration-2 underline-offset-4 hover:text-black"
            >
              Ver carrinho
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold">Detalhes do produto</h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
