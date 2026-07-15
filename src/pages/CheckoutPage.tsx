import { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  Landmark,
  Smartphone,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  getDepartments,
  getProvinces,
  getDistricts,
  getShippingRate,
} from "../services/shippingService";
import Toast from "../components/Toast";
import CustomSelect from "../components/CustomSelect";

declare global {
  interface Window {
    Culqi?: any;
    culqi?: () => void;
  }
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const culqiTokenHandlerRef = useRef<((tokenId: string) => void) | null>(null);

  const [department, setDepartment] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
  } | null>(null);

  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    if (document.getElementById("culqi-checkout-script")) return;

    const script = document.createElement("script");
    script.id = "culqi-checkout-script";
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    window.culqi = () => {
      if (window.Culqi?.token?.id) {
        const tokenId = window.Culqi.token.id;
        window.Culqi.close();
        setIsProcessingPayment(true);
        culqiTokenHandlerRef.current?.(tokenId);
        return;
      }

      if (window.Culqi?.error) {
        setIsProcessingPayment(false);
        setToast({
          type: "error",
          title: "Pago no completado",
          message:
            window.Culqi.error?.user_message ||
            window.Culqi.error?.merchant_message ||
            "No se pudo generar el token de Culqi.",
        });
      }
    };

    return () => {
      delete window.culqi;
    };
  }, []);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  useEffect(() => {
    if (!department) return;
    setProvince("");
    setDistrict("");
    setShippingCost(0);
    getProvinces(department).then(setProvinces).catch(console.error);
  }, [department]);

  useEffect(() => {
    if (!department || !province) return;
    setDistrict("");
    setShippingCost(0);
    getDistricts(department, province).then(setDistricts).catch(console.error);
  }, [department, province]);

  useEffect(() => {
    if (!department || !province || !district) return;

    getShippingRate(department, province, district)
      .then((rate) => setShippingCost(Number(rate.price)))
      .catch(console.error);
  }, [department, province, district]);

  const validateCheckout = () => {
    if (!user) {
      setToast({
        type: "warning",
        title: "Inicia sesión",
        message: "Debes iniciar sesión antes de realizar tu compra.",
      });
      return false;
    }

    if (!name || !phone || !department || !province || !district || !address) {
      setToast({
        type: "warning",
        title: "Datos incompletos",
        message:
          "Completa nombre, celular, departamento, provincia, distrito y dirección.",
      });
      return false;
    }

    if (!/^\d+$/.test(phone)) {
  setToast({
    type: "warning",
    title: "Celular inválido",
    message: "El número de celular solo debe contener números.",
  });
  return false;
}

if (phone.length !== 9) {
  setToast({
    type: "warning",
    title: "Celular inválido",
    message: "Ingresa un número de celular válido de 9 dígitos.",
  });
  return false;
}

if (address.trim().length < 8) {
  setToast({
    type: "warning",
    title: "Dirección muy corta",
    message: "La dirección debe tener como mínimo 8 caracteres.",
  });
  return false;
}

    if (cart.length === 0) {
      setToast({
        type: "error",
        title: "Carrito vacío",
        message: "Agrega al menos un producto antes de confirmar tu pedido.",
      });
      return false;
    }

    return true;
  };

  const registerOrder = async (paymentData: any = null) => {
  if (!user) return;

  try {
    const orderResult = await createOrder({
  userId: user.id,
  customer: {
    name,
    phone,
    address,
    department,
    province,
    district,
    reference,
  },
  paymentMethod,
  cart,
  subtotal: totalPrice,
  shippingCost,
  totalPrice: finalTotal,
  paymentData,
});


const firstResult = Array.isArray(orderResult)
  ? orderResult[0]
  : orderResult;

const orderId =
  typeof firstResult === "string"
    ? firstResult
    : firstResult?.id ??
      firstResult?.order_id ??
      firstResult?.create_complete_order ??
      null;



if (!orderId || typeof orderId !== "string") {
  console.error(
    "No se pudo obtener el UUID de la orden:",
    orderResult,
  );
} else {
  try {
    const { data: emailData, error: emailError } =
      await supabase.functions.invoke("send-order-email", {
        body: {
          orderId,
        },
      });

    if (emailError) {
      let functionError: unknown = null;

      try {
        functionError = await emailError.context?.json();
      } catch {
        functionError = emailError.message;
      }

      console.error(
        "La orden se creó, pero falló el correo:",
        functionError,
      );
    } else {
      console.log(
        "Correo del pedido enviado:",
        emailData,
      );
    }
  } catch (emailError) {
    console.error(
      "Error invocando send-order-email:",
      emailError,
    );
  }
}

    clearCart();

    setToast({
      type: "success",
      title: "Pedido registrado",
      message:
        "Tu pedido se registró correctamente. Te llevaremos a tu cuenta.",
    });

    setTimeout(() => {
      navigate("/mi-cuenta");
    }, 1000);
  } catch (error: any) {
    console.error("ERROR REGISTRANDO PEDIDO:", error);

    setToast({
      type: "error",
      title: "No se pudo registrar el pedido",
      message:
        error?.message ||
        "Ocurrió un problema al registrar la compra o actualizar el stock.",
    });

    throw error;
  }
};

  const payWithCulqi = async (tokenId: string) => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            amount: finalTotal,
            email: user.email,
            source_id: tokenId,
            description: `Compra PadelShop - ${name}`,
            installments: Number(
              window.Culqi?.token?.metadata?.installments ??
                window.Culqi?.token?.installments ??
                1,
            ),
            metadata: {
              customer_name: name,
              customer_phone: phone,
              payment_method: "tarjeta",
            },
            antifraud_details: {
              first_name: name.split(" ")[0] || name,
              last_name: name.split(" ").slice(1).join(" ") || "Cliente",
              address,
              address_city: district,
              country_code: "PE",
              phone_number: phone.replace(/\D/g, ""),
            },
          },
        },
      );

      if (error || !data?.ok) {
        throw new Error(
          data?.error ||
            error?.message ||
            "Culqi rechazó o no procesó el pago.",
        );
      }

      const charge = data.charge;

      const culqiInstallments = Number(charge?.installments ?? 0);

      await registerOrder({
        provider: "culqi",
        status: "paid",
        transactionId: charge?.id ?? null,
        reference: charge?.reference_code ?? null,
        cardBrand: charge?.source?.iin?.card_brand ?? null,

        // Culqi puede devolver 0 cuando es pago sin cuotas.
        // En tu sistema lo guardamos como 1.
        installments: culqiInstallments > 0 ? culqiInstallments : 1,

        paidAt: charge?.date
          ? new Date(Number(charge.date)).toISOString()
          : new Date().toISOString(),
      });
    } catch (error: any) {
      setToast({
        type: "error",
        title: "Pago no realizado",
        message: error?.message || "No se pudo procesar el pago con Culqi.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!validateCheckout()) return;

    if (paymentMethod !== "tarjeta") {
      await registerOrder();
      return;
    }

    const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;

    if (!publicKey) {
      setToast({
        type: "error",
        title: "Culqi no configurado",
        message: "Falta VITE_CULQI_PUBLIC_KEY en las variables del frontend.",
      });
      return;
    }

    if (!window.Culqi) {
      setToast({
        type: "warning",
        title: "Culqi cargando",
        message: "Espera unos segundos y vuelve a intentar.",
      });
      return;
    }

    culqiTokenHandlerRef.current = payWithCulqi;

    window.Culqi.publicKey = publicKey;
    window.Culqi.settings({
      title: "PadelShop",
      currency: "PEN",
      amount: Math.round(finalTotal * 100),
    });
    window.Culqi.options({
      lang: "es",
      installments: true,
      paymentMethods: {
        tarjeta: true,
        yape: false,
        bancaMovil: false,
        agente: false,
        billetera: false,
        cuotealo: false,
      },
      style: {
        bannerColor: "#0a0a0a",
        buttonBackground: "#f04b2f",
        buttonText: "Pagar ahora",
        buttonTextColor: "#ffffff",
        priceColor: "#f04b2f",
      },
    });
    window.Culqi.open();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[320px] rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="relative mx-auto h-28 w-28">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-200 border-t-[#f04b2f]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="animate-bounce text-5xl">🎾</span>
              </div>
            </div>

            <h3 className="mt-6 text-xl font-black text-neutral-950">
              Procesando pago
            </h3>

            <p className="mt-2 text-sm font-medium text-neutral-500">
              Estamos validando tu compra de forma segura...
            </p>
          </div>
        </div>
      )}
      <main className="padel-container py-12">
        <h1 className="text-4xl font-black uppercase text-neutral-950">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <form className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-black">Datos de entrega</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="rounded-xl border p-4"
    placeholder="Nombre completo"
  />

  <input
  type="tel"
  inputMode="numeric"
  value={phone}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    setPhone(onlyNumbers.slice(0, 9));
  }}
  className="rounded-xl border p-4"
  placeholder="Celular"
  maxLength={9}
/>

  <CustomSelect
    value={department}
    placeholder="Departamento"
    options={departments.map((item) => ({
      value: item,
      label: item,
    }))}
    onChange={setDepartment}
  />

  <CustomSelect
    value={province}
    placeholder="Provincia"
    options={provinces.map((item) => ({
      value: item,
      label: item,
    }))}
    onChange={setProvince}
    disabled={!department}
  />

  <CustomSelect
    value={district}
    placeholder="Distrito"
    options={districts.map((item) => ({
      value: item.district,
      label: item.district,
    }))}
    onChange={setDistrict}
    disabled={!province}
    className="md:col-span-2"
  />

  <input
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  className="rounded-xl border p-4 md:col-span-2"
  placeholder="Dirección / domicilio"
  minLength={8}
/>

  <input
    value={reference}
    onChange={(e) => setReference(e.target.value)}
    className="rounded-xl border p-4"
    placeholder="Referencia"
  />
</div>

            <h2 className="mt-8 text-xl font-black">Método de pago</h2>

            <div className="mt-4 grid gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="radio"
                  name="payment"
                  value="tarjeta"
                  checked={paymentMethod === "tarjeta"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={20} />
                Tarjeta (Crédito / Débito)
              </label>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-[#f04b2f] px-5 py-4 text-sm font-black uppercase text-white"
              onClick={handleCreateOrder}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Validando..." : "Confirmar pedido"}
            </button>
          </form>

          <aside className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-black">Resumen</h2>

            <div className="mt-5 space-y-4">
              {cart.map((item) => {
                const availableStock =
                  item.selectedVariant?.stock ?? item.stock ?? Infinity;

                return (
                  <div
                    key={`${item.id}-${item.selectedVariant?.id || "simple"}`}
                    className="rounded-xl border border-neutral-200 p-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-contain"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black">{item.name}</p>

                        {item.selectedVariant && (
                          <p className="mt-1 text-sm text-neutral-500">
                            {item.selectedVariant.type === "shoe_size"
                              ? "Número"
                              : "Talla"}
                            : {item.selectedVariant.value}
                          </p>
                        )}

                        <strong className="mt-1 block text-sm">
                          S/{" "}
                          {(item.price * item.quantity).toLocaleString("es-PE")}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id, item.selectedVariant?.id)
                        }
                        className="self-start text-neutral-400 transition hover:text-[#f04b2f]"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-500">
                        Cantidad
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedVariant?.id,
                              item.quantity - 1,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 transition hover:border-[#f04b2f] hover:text-[#f04b2f]"
                          aria-label="Restar cantidad"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-6 text-center text-sm font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedVariant?.id,
                              item.quantity + 1,
                            )
                          }
                          disabled={item.quantity >= availableStock}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 transition hover:border-[#f04b2f] hover:text-[#f04b2f] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Sumar cantidad"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 border-t pt-5">
              <div className="flex justify-between">
                <span className="font-bold">Subtotal</span>
                <strong>S/ {totalPrice.toLocaleString("es-PE")}</strong>
              </div>

              <div className="flex justify-between">
                <span className="font-bold">Envío</span>
                <strong>S/ {shippingCost.toLocaleString("es-PE")}</strong>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-black">Total</span>
                <strong className="text-xl">
                  S/ {finalTotal.toLocaleString("es-PE")}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
