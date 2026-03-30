"use client";

import {
  startTransition,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartItem } from "@/lib/site-content";

const CART_STORAGE_KEY = "atlas_cart_v1";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = window.localStorage;
    const probeKey = "__atlas_storage_probe__";
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

function normalizeCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.unitPriceFrom === "number" &&
        typeof item.quantity === "number"
    )
    .map((item) => {
      const safeMoq =
        typeof item.moq === "number" && Number.isFinite(item.moq) && item.moq > 0
          ? Math.floor(item.moq)
          : 1;
      const safeQuantity =
        Number.isFinite(item.quantity) && item.quantity > 0
          ? Math.floor(item.quantity)
          : safeMoq;

      return {
        ...item,
        moq: safeMoq,
        quantity: Math.max(safeMoq, safeQuantity),
      };
    });
}

function parsePersistedCart(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    return normalizeCartItems(JSON.parse(raw));
  } catch {
    return null;
  }
}

function readCartCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookiePrefix = `${CART_STORAGE_KEY}=`;
  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(cookiePrefix));

  if (!cookieValue) {
    return null;
  }

  return decodeURIComponent(cookieValue.slice(cookiePrefix.length));
}

function writeCartCookie(items: CartItem[]) {
  if (typeof document === "undefined") {
    return;
  }

  if (items.length === 0) {
    document.cookie = `${CART_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${CART_STORAGE_KEY}=${encodeURIComponent(
    JSON.stringify(items)
  )}; Path=/; Max-Age=${CART_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function readPersistedCart() {
  const storage = getStorage();
  const storageItems = parsePersistedCart(storage?.getItem(CART_STORAGE_KEY) ?? null);

  if (storageItems) {
    return storageItems;
  }

  return parsePersistedCart(readCartCookie()) ?? [];
}

function persistCart(items: CartItem[]) {
  writeCartCookie(items);

  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    if (items.length === 0) {
      storage.removeItem(CART_STORAGE_KEY);
      return;
    }

    storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore persistence failures and keep the cart in memory.
  }
}

function mergeCartItems(currentItems: CartItem[], persistedItems: CartItem[]) {
  if (currentItems.length === 0) {
    return persistedItems;
  }

  if (persistedItems.length === 0) {
    return currentItems;
  }

  const merged = new Map<string, CartItem>();

  for (const item of persistedItems) {
    merged.set(item.slug, item);
  }

  for (const item of currentItems) {
    const existing = merged.get(item.slug);

    if (!existing) {
      merged.set(item.slug, item);
      continue;
    }

    merged.set(item.slug, {
      ...existing,
      name: item.name || existing.name,
      image: item.image || existing.image,
      unitPriceFrom: Number.isFinite(item.unitPriceFrom)
        ? item.unitPriceFrom
        : existing.unitPriceFrom,
      moq: Math.max(existing.moq, item.moq),
      quantity: Math.max(existing.quantity, item.quantity),
    });
  }

  return Array.from(merged.values());
}

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type SetCartItemQuantityInput = Omit<CartItem, "quantity"> & {
  quantity: number;
};

function applyAddCartItem(current: CartItem[], item: AddCartItemInput) {
  const found = current.find((entry) => entry.slug === item.slug);
  const minQty = Math.max(1, Math.floor(item.moq));
  const safeQty = Math.max(minQty, Math.floor(item.quantity ?? minQty));

  if (found) {
    return current.map((entry) =>
      entry.slug === item.slug
        ? { ...entry, quantity: entry.quantity + safeQty, moq: minQty }
        : entry
    );
  }

  return [
    ...current,
    {
      ...item,
      quantity: safeQty,
      moq: minQty,
    },
  ];
}

function applySetCartItemQuantity(current: CartItem[], item: SetCartItemQuantityInput) {
  const minQty = Math.max(1, Math.floor(item.moq));
  const safeQty = Math.max(minQty, Math.floor(item.quantity));
  const nextItem: CartItem = {
    ...item,
    moq: minQty,
    quantity: safeQty,
  };
  const existingIndex = current.findIndex((entry) => entry.slug === item.slug);

  if (existingIndex === -1) {
    return [...current, nextItem];
  }

  return current.map((entry) => (entry.slug === item.slug ? nextItem : entry));
}

function applyUpdateCartQuantity(current: CartItem[], slug: string, quantity: number) {
  return current.map((item) => {
    if (item.slug !== slug) {
      return item;
    }

    const nextQuantity = Math.floor(quantity);
    return {
      ...item,
      quantity: Math.max(item.moq, nextQuantity),
    };
  });
}

function applyRemoveCartItem(current: CartItem[], slug: string) {
  return current.filter((item) => item.slug !== slug);
}

export function persistAddedCartItem(item: AddCartItemInput) {
  const nextItems = applyAddCartItem(readPersistedCart(), item);
  persistCart(nextItems);
  return nextItems;
}

export function persistSetCartItemQuantity(item: SetCartItemQuantityInput) {
  const nextItems = applySetCartItemQuantity(readPersistedCart(), item);
  persistCart(nextItems);
  return nextItems;
}

export function persistUpdatedCartQuantity(slug: string, quantity: number) {
  const nextItems = applyUpdateCartQuantity(readPersistedCart(), slug, quantity);
  persistCart(nextItems);
  return nextItems;
}

export function persistRemovedCartItem(slug: string) {
  const nextItems = applyRemoveCartItem(readPersistedCart(), slug);
  persistCart(nextItems);
  return nextItems;
}

export function persistClearedCart() {
  persistCart([]);
}

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: AddCartItemInput) => void;
  setItemQuantity: (item: SetCartItemQuantityInput) => void;
  updateQty: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nextItems = readPersistedCart();
    const hydrationTimer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }

      startTransition(() => {
        setItems((current) => mergeCartItems(current, nextItems));
        setHydrated(true);
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    persistCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((current) => applyAddCartItem(current, item));
  }, []);

  const setItemQuantity = useCallback((item: SetCartItemQuantityInput) => {
    setItems((current) => applySetCartItemQuantity(current, item));
  }, []);

  const updateQty = useCallback((slug: string, quantity: number) => {
    setItems((current) => applyUpdateCartQuantity(current, slug, quantity));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => applyRemoveCartItem(current, slug));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPriceFrom * item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready: hydrated,
      itemCount,
      subtotal,
      addItem,
      setItemQuantity,
      updateQty,
      removeItem,
      clearCart,
    }),
    [
      items,
      hydrated,
      itemCount,
      subtotal,
      addItem,
      setItemQuantity,
      updateQty,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export const cartStorageKey = CART_STORAGE_KEY;
