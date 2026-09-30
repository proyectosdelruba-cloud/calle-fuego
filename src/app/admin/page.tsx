import { supabaseAdmin } from "@/lib/supabase/admin";
import { updateOrderStatus, type OrderStatus } from "./actions";

export const dynamic = "force-dynamic";

interface OrderItemRow {
  id: string;
  quantity: number;
  unit_price: number;
  is_combo: boolean;
  products: { name: string } | null;
}

interface OrderRow {
  id: string;
  status: OrderStatus;
  delivery_method: "pickup" | "dine_in";
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
  fire_coins_used: number;
  fire_coins_earned: number;
  order_items: OrderItemRow[];
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  preparing: "En preparación",
  ready: "Listo",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-fire-500/15 text-fire-300",
  preparing: "bg-blue-500/15 text-blue-300",
  ready: "bg-emerald-500/15 text-emerald-300",
  completed: "bg-white/10 text-foreground/60",
  cancelled: "bg-red-500/15 text-red-300",
};

async function getOrders(): Promise<{ orders: OrderRow[]; error: string | null }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
          id,
          status,
          delivery_method,
          total,
          customer_name,
          customer_phone,
          notes,
          created_at,
          fire_coins_used,
          fire_coins_earned,
          order_items ( id, quantity, unit_price, is_combo, products ( name ) )
        `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { orders: (data as unknown as OrderRow[]) ?? [], error: null };
  } catch (error) {
    console.error("Error cargando pedidos:", error);
    return {
      orders: [],
      error: "No se pudieron cargar los pedidos. ¿Está Supabase configurado correctamente?",
    };
  }
}

export default async function AdminPage() {
  const { orders, error } = await getOrders();

  return (
    <div>
      {error ? (
        <div className="rounded-xl border border-fire-500/30 bg-fire-500/5 p-6 text-sm text-fire-300">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-white/10 p-6 text-sm text-foreground/60">
          Todavía no hay pedidos.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-char p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-display text-lg">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="ml-3 text-xs text-foreground/50">
                    {new Date(order.created_at).toLocaleString("es-ES")}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="mt-3 text-sm text-foreground/70">
                <p>
                  {order.delivery_method === "pickup" ? "Recoger en local" : "Comer aquí"} ·{" "}
                  {order.customer_name ?? "Sin nombre"} · {order.customer_phone ?? "Sin teléfono"}
                </p>
                {order.notes ? (
                  <p className="mt-1 italic text-foreground/50">&ldquo;{order.notes}&rdquo;</p>
                ) : null}
              </div>

              <ul className="mt-3 flex flex-col gap-1 border-t border-white/5 pt-3 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex justify-between text-foreground/80">
                    <span>
                      {item.quantity}× {item.products?.name ?? "Producto eliminado"}
                      {item.is_combo ? " (combo)" : ""}
                    </span>
                    <span>{(item.unit_price * item.quantity).toFixed(2)} €</span>
                  </li>
                ))}
              </ul>

              {(order.fire_coins_used > 0 || order.fire_coins_earned > 0) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-fire-400">
                  🔥{" "}
                  {order.fire_coins_used > 0 && <span>{order.fire_coins_used} canjeados</span>}
                  {order.fire_coins_used > 0 && order.fire_coins_earned > 0 && <span>·</span>}
                  {order.fire_coins_earned > 0 && <span>{order.fire_coins_earned} ganados</span>}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-semibold">Total: {order.total.toFixed(2)} €</span>
                <form className="flex gap-2">
                  <button
                    formAction={updateOrderStatus.bind(null, order.id, "preparing")}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/70 transition-colors hover:border-fire-500 hover:text-fire-500"
                  >
                    En preparación
                  </button>
                  <button
                    formAction={updateOrderStatus.bind(null, order.id, "ready")}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/70 transition-colors hover:border-fire-500 hover:text-fire-500"
                  >
                    Listo
                  </button>
                  <button
                    formAction={updateOrderStatus.bind(null, order.id, "completed")}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-foreground/70 transition-colors hover:border-fire-500 hover:text-fire-500"
                  >
                    Completado
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}