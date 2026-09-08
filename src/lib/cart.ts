import type { Product } from "../data/products";

export type CartItem = Product & {
  quantity: number;
};

const CART_KEY = "minha-loja-cart";

export function emitCartUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("cart:updated"));
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartUpdate();
}

export function addToCart(product: Product) {
  const current = getCartItems();
  const existing = current.find((item) => item.id === product.id);

  if (existing) {
    const updated = current.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    saveCartItems(updated);
    return updated;
  }

  const updated = [...current, { ...product, quantity: 1 }];
  saveCartItems(updated);
  return updated;
}

export function removeFromCart(productId: number) {
  const current = getCartItems();
  const updated = current.filter((item) => item.id !== productId);
  saveCartItems(updated);
  return updated;
}

export function clearCart() {
  saveCartItems([]);
  return [];
}

export function updateQuantity(productId: number, quantity: number) {
  const current = getCartItems();

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const updated = current.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );

  saveCartItems(updated);
  return updated;
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}
