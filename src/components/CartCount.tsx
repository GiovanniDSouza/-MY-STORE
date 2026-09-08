"use client";

import { useEffect, useState } from "react";
import { getCartCount } from "../lib/cart";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount());
    update();

    window.addEventListener("cart:updated", update);
    return () => window.removeEventListener("cart:updated", update);
  }, []);

  return <>{count}</>;
}
