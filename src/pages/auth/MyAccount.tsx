import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function MyAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [fullName, setFullName] = useState<string | null>("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setIsLogged(false);
        setLoading(false);
        return;
      }

      setIsLogged(true);
      setEmail(data.user.email);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .single();

        const { data: ordersData } = await supabase
  .from("orders")
  .select(`
  id,
  total,
  status,
  payment_method,
  created_at,
  order_items (
    id,
    product_name,
    quantity,
    unit_price,
    subtotal,
    products (
      image_url
    )
  )
`)
  .eq("user_id", data.user.id)
  .order("created_at", { ascending: false });

setOrders(ordersData ?? []);

      setFullName(profile?.full_name ?? null);
      setLoading(false);
    };

    loadUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return null;

  if (!isLogged) return <Navigate to="/login" replace />;

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-14">
      <section className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-[#f04b2f]"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </button>

        <h1 className="text-4xl font-black text-neutral-950">
          Hola, {fullName || "cliente"} 👋
        </h1>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow md:col-span-3">
            <h2 className="text-xl font-black">Mis pedidos</h2>

            {orders.length === 0 ? (
  <div className="mt-6 rounded-xl border border-dashed border-neutral-300 p-10 text-center">
    <p className="font-semibold">
      Cuando realices tu primera compra aparecerá aquí.
    </p>

    <button
      onClick={() => navigate("/")}
      className="mt-5 rounded-xl bg-[#f04b2f] px-6 py-3 font-bold text-white transition hover:bg-[#d94027]"
    >
      Explorar productos
    </button>
  </div>
) : (
  <div className="mt-6 space-y-4">
    {orders.map((order) => (
      <div
        key={order.id}
        className="rounded-xl border border-neutral-200 p-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black">
              Pedido #{order.id.slice(0, 8)}
            </p>
            <p className="text-xs text-neutral-500">
              {new Date(order.created_at).toLocaleDateString("es-PE")}
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase text-yellow-700">
            {order.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {order.order_items?.map((item: any) => (
            <div
  key={item.id}
  className="flex items-center justify-between gap-4 text-sm"
>
  <div className="flex items-center gap-3">
    <img
      src={item.products?.image_url}
      alt={item.product_name}
      className="h-12 w-12 rounded-lg border border-neutral-200 object-contain"
    />

    <span>
      {item.product_name} x{item.quantity}
    </span>
  </div>

  <strong>
    S/ {Number(item.subtotal).toLocaleString("es-PE")}
  </strong>
</div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t pt-4">
          <span className="font-bold">Total</span>
          <strong>S/ {Number(order.total).toLocaleString("es-PE")}</strong>
        </div>
      </div>
    ))}
  </div>
)}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
            <h2 className="font-black text-lg">Direcciones</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Próximamente podrás guardar tus direcciones de envío.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
            <h2 className="font-black text-lg">Favoritos</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Próximamente podrás guardar productos favoritos.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
            <h2 className="font-black text-lg">Soporte</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Escríbenos si necesitas ayuda con una compra.
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 rounded-xl bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-neutral-800"
        >
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}