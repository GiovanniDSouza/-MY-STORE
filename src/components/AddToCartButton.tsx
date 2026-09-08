"use client";

import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import { addToCart, getCartItems } from "../lib/cart";

export function AddToCartButton({ product }: { product: Product }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncCount = () => {
      const item = getCartItems().find((cartItem) => cartItem.id === product.id);
      setCount(item?.quantity ?? 0);
    };

    syncCount();
    window.addEventListener("cart:updated", syncCount);

    return () => window.removeEventListener("cart:updated", syncCount);
  }, [product.id]);

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
    >
      {count > 0 ? `No carrinho (${count})` : "Adicionar ao carrinho"}
    </button>
  );
}
