import { useState } from "react";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");

  const handleCreateOrder = async () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar");
      return;
    }

    if (!name || !phone || !address) {
      alert("Completa nombre, celular y dirección");
      return;
    }

    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    await createOrder({
      userId: user.id,
      customer: {
        name,
        phone,
        address,
        district,
        reference,
      },
      paymentMethod,
      cart,
      totalPrice,
    });

    clearCart();
    alert("Pedido registrado correctamente");
    navigate("/mi-cuenta");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border p-4"
                placeholder="Celular"
              />

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl border p-4 md:col-span-2"
                placeholder="Dirección / domicilio"
              />

              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="rounded-xl border p-4"
                placeholder="Distrito"
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
                Tarjeta
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="radio"
                  name="payment"
                  value="transferencia"
                  checked={paymentMethod === "transferencia"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Landmark size={20} />
                Transferencia bancaria
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="radio"
                  name="payment"
                  value="yape_plin"
                  checked={paymentMethod === "yape_plin"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Smartphone size={20} />
                Yape / Plin
              </label>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-[#f04b2f] px-5 py-4 text-sm font-black uppercase text-white"
              onClick={handleCreateOrder}
            >
              Confirmar pedido
            </button>
          </form>

          <aside className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-black">Resumen</h2>

            <div className="mt-5 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} className="h-16 w-16 object-contain" />
                  <div className="flex-1">
                    <p className="text-sm font-black">{item.name}</p>
                    <p className="text-sm text-neutral-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <strong className="text-sm">
                    S/ {(item.price * item.quantity).toLocaleString("es-PE")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t pt-5">
              <span className="font-bold">Total</span>
              <strong className="text-xl">
                S/ {totalPrice.toLocaleString("es-PE")}
              </strong>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}