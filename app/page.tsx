import Image from "next/image";
import Link from "next/link";
import { CartCount } from "../src/components/CartCount";
import { formatPrice, products } from "../src/data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Loja digital
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Minha Loja</h1>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["Início", "/"],
              ["Produtos", "/produtos"],
              ["Coleções", "/produtos"],
              ["Sobre", "/#sobre"],
              ["Contato", "/#contato"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/carrinho"
            className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
          >
            Carrinho (<CartCount />)
          </Link>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_top,_#f5f5f5,_#f3f4f6_30%,_#ffffff_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Bem-vindo
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Itens essenciais
              <span className="block text-gray-500">para o seu dia a dia.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Produtos selecionados com qualidade premium, preço justo e entrega
              rápida para você viver melhor.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produtos"
                className="rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
              >
                Ver produtos
              </Link>
              <Link
                href="#sobre"
                className="rounded-full border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Saiba mais
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-100 p-6">
                <p className="text-sm text-gray-500">Entrega</p>
                <p className="mt-4 text-3xl font-bold">24h</p>
              </div>

              <div className="rounded-2xl bg-black p-6 text-white">
                <p className="text-sm text-gray-300">Avaliação</p>
                <p className="mt-4 text-3xl font-bold">4,9★</p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-6 sm:col-span-2">
                <p className="text-sm text-gray-500">Oferta da semana</p>
                <p className="mt-3 text-2xl font-bold">Até 40% off</p>
                <p className="mt-2 text-sm text-gray-600">
                  Em produtos selecionados para casa e trabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Destaques
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Produtos em destaque
            </h2>
          </div>

          <Link
            href="/produtos"
            className="text-sm font-medium text-gray-700 underline decoration-2 underline-offset-4"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.name}
              name={product.name}
              price={formatPrice(product.price)}
              category={product.category}
              image={product.image}
              href={`/produtos/${product.slug}`}
            />
          ))}
        </div>
      </section>

      <section id="sobre" className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-3">
          {[
            ["Frete grátis", "Em compras acima de R$ 200"],
            ["Pagamento seguro", "Até 12x sem juros"],
            ["Suporte rápido", "Atendimento por WhatsApp"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contato" className="bg-black px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold">Minha Loja</p>
            <p className="mt-1 text-sm text-gray-400">
              Qualidade, conforto e praticidade.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            © 2026 Minha Loja. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ProductCard({
  name,
  price,
  category,
  image,
  href,
}: {
  name: string;
  price: string;
  category: string;
  image: string;
  href: string;
}) {
  return (
    <article className="group rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={href}
        className="block overflow-hidden rounded-2xl bg-gray-100"
      >
        <Image
          src={image}
          alt={name}
          width={800}
          height={800}
          unoptimized
          className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          {category}
        </p>
        <h3 className="mt-2 text-lg font-semibold">{name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold">{price}</p>
          <Link
            href={href}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Comprar
          </Link>
        </div>
      </div>
    </article>
  );
}
