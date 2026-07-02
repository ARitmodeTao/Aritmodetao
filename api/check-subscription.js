// api/check-subscription.js
// Dado un email, consulta directamente a Stripe si existe una suscripción
// activa asociada. No usamos base de datos propia: Stripe ya es la fuente
// de verdad de quién ha pagado.

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
      return res.status(200).json({ premium: false });
    }

    const customerId = customers.data[0].id;
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    return res.status(200).json({ premium: subs.data.length > 0 });
  } catch (err) {
    console.error("Error comprobando suscripción:", err.message);
    return res.status(500).json({ error: "No se pudo comprobar la suscripción" });
  }
}
