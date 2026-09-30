import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { eurosToCoinsEarned, coinsToDiscount, maxRedeemableCoins } from "@/lib/fireCoins";

interface OrderItemPayload {
  product_id: string;
  quantity: number;
  unit_price: number;
  isCombo?: boolean;
}

interface OrderPayload {
  deliveryMethod: "pickup" | "dine_in";
  customer: { name: string; phone: string; notes?: string };
  items: OrderItemPayload[];
  total: number;
  fireCoinsRedeemed?: number;
}

export async function POST(request: Request) {
  try {
    // 1. Identificamos al usuario a partir de la cookie de sesión.
    //    Los Fire Coins solo tienen sentido con una cuenta detrás.
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para completar el pedido." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as OrderPayload;
    const { deliveryMethod, customer, items, total } = body;
    const requestedRedeem = Math.max(0, Math.floor(body.fireCoinsRedeemed ?? 0));

    if (!deliveryMethod || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
    }

    // 2. Validamos el canje de Fire Coins contra el saldo REAL del usuario
    //    (nunca nos fiamos del número que manda el cliente).
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("fire_coins")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      throw profileError ?? new Error("No se encontró el perfil del usuario");
    }

    const coinsRedeemed = Math.min(requestedRedeem, maxRedeemableCoins(total, profile.fire_coins));
    const discount = coinsToDiscount(coinsRedeemed);
    const finalTotal = Math.max(total - discount, 0);
    const coinsEarned = eurosToCoinsEarned(finalTotal);

    // 3. Creamos el pedido y sus líneas.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        delivery_method: deliveryMethod,
        total: finalTotal,
        customer_name: customer?.name ?? null,
        customer_phone: customer?.phone ?? null,
        notes: customer?.notes ?? null,
        status: "pending",
        fire_coins_used: coinsRedeemed,
        fire_coins_earned: coinsEarned,
      })
      .select()
      .single();

    if (orderError || !order) {
      throw orderError ?? new Error("No se pudo crear el pedido");
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      is_combo: item.isCombo ?? false,
    }));

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    const orderNumber = String(order.id).slice(0, 8).toUpperCase();
    let newBalance = profile.fire_coins;

    // 4. Aplicamos el canje y el ingreso de Fire Coins de forma atómica
    //    mediante la función SQL adjust_fire_coins() (ver fase6_fire_coins.sql).
    if (coinsRedeemed > 0) {
      const { data, error } = await supabaseAdmin.rpc("adjust_fire_coins", {
        p_user_id: user.id,
        p_amount: -coinsRedeemed,
        p_reason: `Canje en pedido #${orderNumber}`,
        p_order_id: order.id,
      });
      if (error) throw error;
      newBalance = data;
    }

    if (coinsEarned > 0) {
      const { data, error } = await supabaseAdmin.rpc("adjust_fire_coins", {
        p_user_id: user.id,
        p_amount: coinsEarned,
        p_reason: `Fire Coins ganados en el pedido #${orderNumber}`,
        p_order_id: order.id,
      });
      if (error) throw error;
      newBalance = data;
    }

    return NextResponse.json({
      id: order.id,
      orderNumber,
      finalTotal,
      coinsRedeemed,
      coinsEarned,
      newBalance,
    });
  } catch (error) {
    console.error("Error creando pedido:", error);
    return NextResponse.json({ error: "No se pudo crear el pedido" }, { status: 500 });
  }
}