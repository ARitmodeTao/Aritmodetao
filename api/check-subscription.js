// api/check-subscription.js
// Dado un email, consulta directamente a Stripe qué acceso tiene:
// - premium: suscripción activa (todo, incluidas novedades futuras)
// - accesoCompleto: pago único de "Acceso completo" (los recorridos de hoy)
// - recorridosComprados: lista de IDs de recorridos comprados sueltos
//
// No usamos base de datos propia: Stripe ya es la fuente de verdad.
// Identificamos qué se compró gracias al "client_reference_id" que la app
// añade a la URL del enlace de pago antes de redirigir (por ejemplo
// "acceso-completo" o el id del recorrido, como "retencion-liquidos").

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const email = req.method === "POST" ? (req.body || {}).email : req.query.email;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email no válido" });
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return res.status(200).json({ premium: false, accesoCompleto: false, recorridosComprados: [] });
    }

    const customerId = customers.data[0].id;

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const premium = subs.data.length > 0;

    const sesiones = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    const referencias = sesiones.data
      .filter((s) => s.payment_status === "paid" && s.mode === "payment" && s.client_reference_id)
      .map((s) => s.client_reference_id);

    const accesoCompleto = referencias.includes("acceso-completo");
    const recorridosComprados = [...new Set(referencias.filter((r) => r !== "acceso-completo"))];

    return res.status(200).json({ premium, accesoCompleto, recorridosComprados });
  } catch (err) {
    console.error("Error comprobando suscripción:", err.message);
    return res.status(500).json({ error: "No se pudo comprobar la suscripción" });
  }
}
