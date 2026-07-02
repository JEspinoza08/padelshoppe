import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const statuses = ["pendiente", "pagado", "preparando", "enviado", "entregado", "cancelado"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_phone,
        customer_address,
        customer_district,
        customer_reference,
        payment_method,
        total,
        status,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          subtotal,
          products (
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setOrders(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select();

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  console.log("Orden actualizada:", data);

  setOrders((prev) =>
    prev.map((order) =>
      order.id === orderId ? { ...order, status } : order
    )
  );
};

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <p className="text-white">Cargando pedidos...</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-black text-white">Pedidos</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-white">
                  Pedido #{order.id.slice(0, 8)}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleString("es-PE")}
                </p>

                <p className="mt-3 text-sm text-white">
                  Cliente: <b>{order.customer_name}</b>
                </p>

                <p className="text-sm text-gray-300">
                  Celular: {order.customer_phone}
                </p>

                <p className="text-sm text-gray-300">
                  Dirección: {order.customer_address}, {order.customer_district}
                </p>

                {order.customer_reference && (
                  <p className="text-sm text-gray-300">
                    Referencia: {order.customer_reference}
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-300">
                  Pago: {order.payment_method}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm font-bold text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
              {order.order_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.products?.image_url}
                      alt={item.product_name}
                      className="h-12 w-12 rounded-lg bg-white object-contain"
                    />

                    <p className="text-sm font-bold text-white">
                      {item.product_name} x{item.quantity}
                    </p>
                  </div>

                  <strong className="text-sm text-white">
                    S/ {Number(item.subtotal).toLocaleString("es-PE")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
              <span className="font-bold text-white">Total</span>
              <strong className="text-lg text-white">
                S/ {Number(order.total).toLocaleString("es-PE")}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}