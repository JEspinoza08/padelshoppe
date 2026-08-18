import { supabase } from "../lib/supabase";

export async function createOrder({
  userId,
  customer,
  paymentMethod,
  cart,
  totalPrice,
  subtotal,
  shippingCost,
  paymentData = null,
}: any) {
  if (!userId) {
    throw new Error("Usuario no autenticado.");
  }

  if (!cart || cart.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  if (!/^\d{8}$/.test(customer?.dni ?? "")) {
  throw new Error("El DNI debe contener exactamente 8 dígitos.");
}

  const orderData = {
    user_id: userId,

    customer_name: customer.name,
    customer_dni: customer.dni,
    customer_phone: customer.phone,
    customer_address: customer.address,
    customer_department: customer.department,
    customer_province: customer.province,
    customer_district: customer.district,
    customer_reference: customer.reference || null,
    customer_zone:
      customer.department === "Lima" ? "Lima" : "Provincia",

    payment_method: paymentMethod,
    payment_provider: paymentData?.provider ?? null,
    payment_status: paymentData?.status ?? "pending",
    payment_transaction_id: paymentData?.transactionId ?? null,
    payment_reference: paymentData?.reference ?? null,
    card_brand: paymentData?.cardBrand ?? null,
    installments: paymentData?.installments ?? 1,
    paid_at: paymentData?.paidAt ?? null,

    subtotal,
    shipping_cost: shippingCost,
    total: totalPrice,
  };

  const items = cart.map((item: any) => ({
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,

    variant_id: item.selectedVariant?.id ?? null,
    variant_type: item.selectedVariant?.type ?? null,
    variant_value: item.selectedVariant?.value ?? null,
  }));

  const { data: order, error } = await supabase.rpc(
    "create_complete_order",
    {
      p_order: orderData,
      p_items: items,
    }
  );

  if (error) {
    console.error("Error creando la orden:", error);

    const errorMessage = error.message?.toLowerCase() ?? "";

    if (
      errorMessage.includes("stock") ||
      errorMessage.includes("insuficiente")
    ) {
      throw new Error(
        "Uno de los productos ya no tiene stock suficiente. Actualiza tu carrito."
      );
    }

    throw new Error(
      error.message || "No se pudo crear la orden."
    );
  }

  return order;
}