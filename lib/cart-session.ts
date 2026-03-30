import { cookies } from "next/headers";

import { products, type CartItem, type Product } from "@/lib/site-content";

const INQUIRY_CART_COOKIE = "atlas_inquiry_cart_v2";
const INQUIRY_CART_MAX_AGE = 60 * 60 * 24 * 30;

const productBySlug = new Map(products.map((product) => [product.slug, product]));

function normalizeQuantity(value: unknown, minimum: number) {
  const nextValue =
    typeof value === "number" && Number.isFinite(value)
      ? Math.floor(value)
      : Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(nextValue) || nextValue <= 0) {
    return minimum;
  }

  return Math.max(minimum, Math.floor(nextValue));
}

function getProductBySlug(slug: string) {
  return productBySlug.get(slug);
}

function getCartItemFromProduct(product: Product, quantity: number): CartItem {
  return {
    slug: product.slug,
    name: product.name,
    image: product.image,
    unitPriceFrom: product.priceFrom,
    moq: product.moq,
    quantity: normalizeQuantity(quantity, product.moq),
  };
}

function normalizeCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  const normalized = new Map<string, CartItem>();

  for (const item of rawItems) {
    if (!item || typeof item !== "object" || typeof item.slug !== "string") {
      continue;
    }

    const product = getProductBySlug(item.slug);
    if (!product) {
      continue;
    }

    const nextItem = getCartItemFromProduct(product, item.quantity);
    const existing = normalized.get(product.slug);

    if (!existing) {
      normalized.set(product.slug, nextItem);
      continue;
    }

    normalized.set(product.slug, {
      ...existing,
      quantity: existing.quantity + nextItem.quantity,
      moq: Math.max(existing.moq, nextItem.moq),
    });
  }

  return Array.from(normalized.values());
}

function parseCartCookie(rawValue: string | undefined) {
  if (!rawValue) {
    return [];
  }

  try {
    return normalizeCartItems(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

async function getCookieStore() {
  return cookies();
}

async function writeInquiryCart(items: CartItem[]) {
  const cookieStore = await getCookieStore();

  if (items.length === 0) {
    cookieStore.delete(INQUIRY_CART_COOKIE);
    return;
  }

  cookieStore.set(INQUIRY_CART_COOKIE, JSON.stringify(items), {
    path: "/",
    maxAge: INQUIRY_CART_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function getInquiryCart() {
  const cookieStore = await getCookieStore();
  return parseCartCookie(cookieStore.get(INQUIRY_CART_COOKIE)?.value);
}

export async function getInquiryCartCount() {
  const items = await getInquiryCart();
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addProductToInquiryCart(slug: string, quantity?: number) {
  const product = getProductBySlug(slug);
  if (!product) {
    return getInquiryCart();
  }

  const currentItems = await getInquiryCart();
  const quantityToAdd = normalizeQuantity(quantity, product.moq);
  const existingItem = currentItems.find((item) => item.slug === slug);

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.slug === slug
          ? {
              ...item,
              quantity: item.quantity + quantityToAdd,
              moq: product.moq,
              unitPriceFrom: product.priceFrom,
              image: product.image,
              name: product.name,
            }
          : item
      )
    : [...currentItems, getCartItemFromProduct(product, quantityToAdd)];

  await writeInquiryCart(nextItems);
  return nextItems;
}

export async function setInquiryCartQuantity(slug: string, quantity: number) {
  const product = getProductBySlug(slug);
  if (!product) {
    return getInquiryCart();
  }

  const currentItems = await getInquiryCart();
  const nextQuantity = normalizeQuantity(quantity, product.moq);
  const nextItems = currentItems.map((item) =>
    item.slug === slug ? getCartItemFromProduct(product, nextQuantity) : item
  );

  await writeInquiryCart(nextItems);
  return nextItems;
}

export async function removeInquiryCartItem(slug: string) {
  const currentItems = await getInquiryCart();
  const nextItems = currentItems.filter((item) => item.slug !== slug);
  await writeInquiryCart(nextItems);
  return nextItems;
}

export async function clearInquiryCart() {
  await writeInquiryCart([]);
}

