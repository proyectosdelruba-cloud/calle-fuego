"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await supabaseAdmin.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin");
}

export async function grantFireCoins(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const amount = Math.max(0, Math.round(Number(formData.get("amount") ?? 0)));
  const reasonInput = String(formData.get("reason") ?? "").trim();

  if (!userId || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const reason = reasonInput || "Regalo del admin";

  const { error } = await supabaseAdmin.rpc("adjust_fire_coins", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_order_id: null,
  });

  if (error) {
    console.error("Error al regalar Fire Coins:", error);
  }

  revalidatePath("/admin/usuarios");
}