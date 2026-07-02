import { X, Trash2, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/50" onClick={onClose}>
      <aside
        className="ml-auto h-full w-full max-w-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-black">Mi carrito</h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Tu carrito está vacío.
            </p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-neutral-200 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-contain"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-black">{item.name}</h3>

                    <p className="mt-1 text-sm text-neutral-500">
                      Cantidad: {item.quantity}
                    </p>

                    <strong className="mt-2 block text-sm">
                      S/ {(item.price * item.quantity).toLocaleString("es-PE")}
                    </strong>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-400 hover:text-[#f04b2f]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">Total</span>
              <strong className="text-xl">
                S/ {totalPrice.toLocaleString("es-PE")}
              </strong>
            </div>

            <div className="grid gap-3">
              <button
  onClick={() => {
    onClose();
    navigate("/checkout");
  }}
  className="flex items-center justify-center gap-2 rounded-xl bg-[#f04b2f] px-4 py-3 text-sm font-black uppercase text-white"
>
  <CreditCard size={18} />
  Finalizar pedido
</button>

              <button
                onClick={clearCart}
                className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-black uppercase"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}