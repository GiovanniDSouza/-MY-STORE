"use client";
import { useState } from "react";

export default function NewProductForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Geral");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        category,
        price: Number(price),
        image,
        description,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setName("");
      setSlug("");
      setCategory("Geral");
      setPrice(0);
      setImage("");
      setDescription("");
      onCreated?.();
      alert("Produto criado com sucesso");
    } else {
      const body = await res.json().catch(() => ({}));
      alert("Erro ao criar produto: " + (body.error ?? res.statusText));
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div>
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <label>Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Geral">Geral</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Casa">Casa</option>
          <option value="Eletrônicos">Eletrônicos</option>
        </select>
      </div>
      <div>
        <label>Preço</label>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
      </div>
      <div>
        <label>Imagem (URL)</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <div>
        <label>Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar produto"}</button>
    </form>
  );
}
