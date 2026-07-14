import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      amount,
      email,
      source_id,
      description,
      installments = 1,
      metadata = {},
      antifraud_details = {},
    } = await req.json();
    console.log("===== BODY RECIBIDO =====");
console.log({
  amount,
  email,
  source_id,
  description,
  installments,
  metadata,
  antifraud_details,
});

   if (!amount || !email || !source_id) {
  return new Response(
    JSON.stringify({
      ok: false,
      error: "Faltan datos obligatorios para Culqi",
      received: {
        amount,
        email,
        source_id,
      },
    }),
    {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

    const privateKey = Deno.env.get("CULQI_PRIVATE_KEY");

    if (!privateKey) {
      return new Response(
        JSON.stringify({ ok: false, error: "CULQI_PRIVATE_KEY no configurado" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);

    const selectedInstallments = Number(installments || 1);

const chargePayload: any = {
  amount: amountInCents,
  currency_code: "PEN",
  email,
  source_id,
  description: description || "Compra PadelShop",
  metadata,
  antifraud_details,
};

// Solo enviar installments cuando el cliente eligió más de una cuota
if (selectedInstallments > 1) {
  chargePayload.installments = selectedInstallments;
}

    const response = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chargePayload),
    });

    const data = await response.json();
    console.log("===== CULQI STATUS =====", response.status);
console.log("===== CULQI RESPONSE =====", JSON.stringify(data, null, 2));

    if (!response.ok) {
  const declineCode =
    data?.decline_code ||
    data?.outcome?.decline_code ||
    data?.code ||
    data?.param ||
    data?.type;

  const errorMessages: Record<string, string> = {
    insufficient_funds: "La tarjeta no tiene fondos suficientes.",
    stolen_card: "La tarjeta fue reportada como robada.",
    lost_card: "La tarjeta fue reportada como perdida.",
    incorrect_cvv: "El código de seguridad CVV es incorrecto.",
    invalid_card: "La tarjeta ingresada no es válida.",
    expired_card: "La tarjeta está vencida.",
    contact_issuer: "Comunícate con el banco emisor de la tarjeta.",
    parameter_error: "Hay datos inválidos en el pago. Revisa la información ingresada.",
  };

  const friendlyMessage =
    errorMessages[declineCode] ||
    data?.user_message ||
    data?.merchant_message ||
    data?.message ||
    "No se pudo procesar el pago con Culqi.";

  return new Response(
    JSON.stringify({
      ok: false,
      error: friendlyMessage,
      decline_code: declineCode,
      culqi: data,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

    return new Response(JSON.stringify({ ok: true, charge: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
