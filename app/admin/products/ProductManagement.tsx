"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  description: string | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type ProductFormValues = {
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

const emptyForm = (): ProductFormValues => ({
  name: "",
  slug: "",
  category: "Geral",
  price: 0,
  image: "",
  description: "",
});

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Deseja realmente excluir este produto?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Não foi possível excluir o produto.");
      }

      if (editingProductId === id) {
        setEditingProductId(null);
      }

      await loadProducts();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao excluir produto.",
      );
    }
  };

  const editingProduct = products.find((product) => product.id === editingProductId) ?? null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Produtos</p>
          <p className="mt-4 text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Valor total</p>
          <p className="mt-4 text-3xl font-bold text-white">
            {formatCurrency(products.reduce((sum, item) => sum + item.price, 0))}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status</p>
          <p className="mt-4 text-xl font-semibold text-emerald-300">Operação ativa</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              {editingProduct ? "Edição" : "Cadastro"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {editingProduct ? "Editar produto" : "Adicionar produto"}
            </h2>
          </div>
          <NewProductForm
            onCreated={async () => {
              setEditingProductId(null);
              await loadProducts();
            }}
            mode={editingProduct ? "edit" : "create"}
            initialValues={
              editingProduct
                ? {
                    name: editingProduct.name,
                    slug: editingProduct.slug,
                    category: editingProduct.category,
                    price: editingProduct.price,
                    image: editingProduct.image ?? "",
                    description: editingProduct.description ?? "",
                  }
                : emptyForm()
            }
            id={editingProductId ?? undefined}
            onCancel={() => setEditingProductId(null)}
          />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Catálogo</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Produtos cadastrados</h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-slate-300">
              Carregando produtos...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-slate-300">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image ?? ""}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white">{product.name}</p>
                      <p className="text-sm text-slate-400">{product.category}</p>
                      <p className="text-sm font-medium text-emerald-300">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                      {product.slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingProductId(product.id)}
                      className="rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewProductForm({
  onCreated,
  mode = "create",
  initialValues,
  id,
  onCancel,
}: {
  onCreated: () => Promise<void> | void;
  mode?: "create" | "edit";
  initialValues?: ProductFormValues;
  id?: number;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "Geral");
  const [price, setPrice] = useState(initialValues?.price ?? 0);
  const [image, setImage] = useState(initialValues?.image ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialValues) return;
    setName(initialValues.name ?? "");
    setSlug(initialValues.slug ?? "");
    setCategory(initialValues.category ?? "Geral");
    setPrice(initialValues.price ?? 0);
    setImage(initialValues.image ?? "");
    setDescription(initialValues.description ?? "");
  }, [initialValues]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        category,
        price: Number(price),
        image,
        description,
      };

      const endpoint = mode === "edit" && id ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = mode === "edit" && id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao salvar produto.");
      }

      if (mode === "create") {
        setName("");
        setSlug("");
        setCategory("Geral");
        setPrice(0);
        setImage("");
        setDescription("");
      }

      await onCreated();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao salvar produto.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Nome</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          placeholder="Ex: Notebook Pro"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Slug</label>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          placeholder="notebook-pro"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Categoria</label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
        >
          <option value="Geral">Geral</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Casa">Casa</option>
          <option value="Eletrônicos">Eletrônicos</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Preço</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Imagem (URL)</label>
        <input
          value={image}
          onChange={(event) => setImage(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Descrição</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full min-h-28 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
          placeholder="Descrição do produto"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (mode === "edit" ? "Salvando..." : "Criando...") : mode === "edit" ? "Salvar alterações" : "Salvar produto"}
        </button>

        {mode === "edit" && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
