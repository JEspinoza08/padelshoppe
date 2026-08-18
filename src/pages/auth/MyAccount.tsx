import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  PackageCheck,
  SlidersHorizontal,
  Truck,
  XCircle,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const orderSteps = [
  {
    key: "pendiente",
    label: "Pendiente",
    description: "Pedido recibido",
    icon: Clock3,
  },
  {
    key: "preparando",
    label: "Preparando",
    description: "Estamos preparando tu compra",
    icon: PackageCheck,
  },
  {
    key: "enviado",
    label: "Enviado",
    description: "Tu pedido está en camino",
    icon: Truck,
  },
  {
    key: "entregado",
    label: "Entregado",
    description: "Pedido entregado",
    icon: Check,
  },
];

const statusPosition: Record<string, number> = {
  pendiente: 0,
  preparando: 1,
  enviado: 2,
  entregado: 3,
};

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelado") {
    return (
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3 text-red-700">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <XCircle size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black">Pedido cancelado</p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              Este pedido fue cancelado. Comunícate con soporte si necesitas
              ayuda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = statusPosition[status] ?? 0;

  return (
    <div className="mt-5">
      {/* Timeline móvil */}
      <div className="space-y-0 sm:hidden">
        {orderSteps.map((step, index) => {
          const Icon = step.icon;
          const completed = index < currentStep;
          const active = index === currentStep;
          const reached = index <= currentStep;
          const isLast = index === orderSteps.length - 1;

          return (
            <div key={step.key} className="relative flex gap-4">
              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] bg-white ${
                    reached
                      ? "border-[#f04b2f] text-[#f04b2f]"
                      : "border-neutral-200 text-neutral-400"
                  }`}
                >
                  {completed ? <Check size={17} /> : <Icon size={17} />}
                </div>

                {!isLast && (
                  <div
                    className={`h-14 w-1 ${
                      index < currentStep ? "bg-[#f04b2f]" : "bg-neutral-200"
                    }`}
                  />
                )}
              </div>

              <div className="min-w-0 pb-5 pt-1">
                <p
                  className={`text-xs font-black uppercase ${
                    reached ? "text-neutral-950" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {step.description}
                </p>

                {active && (
                  <span className="mt-2 inline-block rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-[#f04b2f]">
                    Estado actual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline desktop y tablet */}
      <div className="relative hidden sm:block">
        <div className="absolute left-[7%] right-[7%] top-5 h-1 rounded-full bg-neutral-200" />

        <div
          className="absolute left-[7%] top-5 h-1 rounded-full bg-[#f04b2f] transition-all duration-500"
          style={{
            width: `${(currentStep / (orderSteps.length - 1)) * 86}%`,
          }}
        />

        <div className="relative grid grid-cols-4">
          {orderSteps.map((step, index) => {
            const Icon = step.icon;
            const completed = index < currentStep;
            const active = index === currentStep;
            const reached = index <= currentStep;

            return (
              <div key={step.key} className="min-w-0 px-2 text-center">
                <div
                  className={`relative mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 bg-white transition ${
                    reached
                      ? "border-[#f04b2f] text-[#f04b2f]"
                      : "border-neutral-200 text-neutral-400"
                  }`}
                >
                  {completed ? <Check size={18} /> : <Icon size={18} />}
                </div>

                <p
                  className={`mt-3 text-xs font-black uppercase ${
                    active || completed
                      ? "text-neutral-950"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-neutral-500">
                  {step.description}
                </p>

                {active && (
                  <span className="mt-2 inline-block rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-[#f04b2f]">
                    Estado actual
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MyAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [fullName, setFullName] = useState<string | null>("");
  const [orders, setOrders] = useState<any[]>([]);
  const getTodayLocal = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);

    return localDate.toISOString().split("T")[0];
  };

  const today = getTodayLocal();

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [showFilters, setShowFilters] = useState(false);

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
        .select(
          `
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
`,
        )
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

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);

    if (dateFrom) {
      const from = new Date(`${dateFrom}T00:00:00`);

      if (orderDate < from) {
        return false;
      }
    }

    if (dateTo) {
      const to = new Date(`${dateTo}T23:59:59`);

      if (orderDate > to) {
        return false;
      }
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-14">
      <section className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-[#f04b2f]"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-neutral-950">
              Hola, {fullName || "cliente"} 👋
            </h1>

            {email && <p className="mt-1 text-sm text-neutral-500">{email}</p>}
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl bg-neutral-950 px-6 py-2.5 font-bold text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 md:col-span-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">Mis pedidos</h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {filteredOrders.length} de {orders.length} pedidos
                  </p>
                </div>

                {/* Botón de filtros solo en móvil */}
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-700 transition hover:border-[#f04b2f] hover:text-[#f04b2f] sm:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filtrar
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Filtros: desplegables en móvil, siempre visibles desde sm */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showFilters
                    ? "max-h-[400px] opacity-100"
                    : "max-h-0 opacity-0 sm:max-h-[400px] sm:opacity-100"
                }`}
              >
                <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:border-0 sm:bg-transparent sm:p-0">
                  <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <label className="block min-w-0">
                      <span className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                        Desde
                      </span>

                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(event) => setDateFrom(event.target.value)}
                        max={dateTo || undefined}
                        className="block w-full min-w-0 max-w-full box-border rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#f04b2f]"
                      />
                    </label>

                    <label className="block min-w-0">
                      <span className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                        Hasta
                      </span>

                      <input
                        type="date"
                        value={dateTo}
                        onChange={(event) => setDateTo(event.target.value)}
                        min={dateFrom || undefined}
                        className="block w-full min-w-0 max-w-full box-border rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#f04b2f]"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDateFrom(today);
                        setDateTo(today);
                      }}
                      disabled={dateFrom === today && dateTo === today}
                      className="self-end rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-bold transition hover:border-[#f04b2f] hover:text-[#f04b2f] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Hoy
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
            ) : filteredOrders.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-neutral-300 p-10 text-center">
                <p className="font-semibold">
                  No encontramos pedidos dentro de las fechas seleccionadas.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setDateFrom(today);
                    setDateTo(today);
                  }}
                  className="mt-5 rounded-xl border border-neutral-200 px-6 py-3 font-bold transition hover:border-[#f04b2f] hover:text-[#f04b2f]"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 p-3 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black">
                          Pedido #{order.id.slice(0, 8)}
                        </p>

                        <p className="text-xs text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "es-PE",
                          )}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                          order.status === "cancelado"
                            ? "bg-red-100 text-red-700"
                            : order.status === "entregado"
                              ? "bg-green-100 text-green-700"
                              : order.status === "enviado"
                                ? "bg-violet-100 text-violet-700"
                                : order.status === "preparando"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-5">
                      <OrderTimeline status={order.status} />
                    </div>

                    <div className="mt-4 space-y-2">
                      {order.order_items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex min-w-0 items-center justify-between gap-3 text-sm"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <img
                              src={item.products?.image_url}
                              alt={item.product_name}
                              className="h-12 w-12 shrink-0 rounded-lg border border-neutral-200 object-contain"
                            />

                            <span className="min-w-0 break-words text-xs leading-5 sm:text-sm">
                              {item.product_name} x{item.quantity}
                            </span>
                          </div>

                          <strong className="shrink-0 whitespace-nowrap text-xs sm:text-sm">
                            S/ {Number(item.subtotal).toLocaleString("es-PE")}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between border-t pt-4">
                      <span className="font-bold">Total</span>
                      <strong>
                        S/ {Number(order.total).toLocaleString("es-PE")}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
