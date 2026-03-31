'use server'

import { redirect } from "next/navigation"

import {
  addProductToInquiryCart,
  clearInquiryCart,
  removeInquiryCartItem,
  setInquiryCartQuantity,
} from "@/lib/cart-session"

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function readInteger(formData: FormData, key: string) {
  const value = readString(formData, key)
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function addInquiryItemAction(formData: FormData) {
  const slug = readString(formData, "slug")
  const quantity = readInteger(formData, "quantity")

  if (slug) {
    await addProductToInquiryCart(slug, quantity)
  }

  redirect("/cart")
}

export async function setInquiryQuantityAction(formData: FormData) {
  const slug = readString(formData, "slug")
  const quantity = readInteger(formData, "quantity")

  if (slug && typeof quantity === "number") {
    await setInquiryCartQuantity(slug, quantity)
  }
}

export async function removeInquiryItemAction(formData: FormData) {
  const slug = readString(formData, "slug")

  if (slug) {
    await removeInquiryCartItem(slug)
  }
}

export async function clearInquiryCartAction() {
  await clearInquiryCart()
}
