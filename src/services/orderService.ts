import { supabase } from "../lib/supabase";

export async function createOrder({
  userId,
  customer,
  paymentMethod,
  cart,
  totalPrice,
}: any) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: customer.address,
      customer_district: customer.district,
      customer_reference: customer.reference,
      payment_method: paymentMethod,
      total: totalPrice,
      status: "pendiente",
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const items = cart.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items);

  if (itemsError) throw itemsError;

  return order;
}