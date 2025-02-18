const express = require("express");
const router = express.Router();
const paypalClient = require("../config/paypal");
const paypal = require("@paypal/checkout-server-sdk");

// Verificación de credenciales
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

console.log("Configurer PayPal avec:", {
  clientIdLength: clientId?.length,
  clientSecretLength: clientSecret?.length,
});

if (!clientId || !clientSecret) {
  throw new Error("PayPal credentials are missing");
}

// Configuración de PayPal con mejor manejo de errores
let client;
try {
  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret
  );
  client = new paypal.core.PayPalHttpClient(environment);
  console.log("Client PayPal configuré avec succès");
} catch (error) {
  console.error("Erreur lors de la configuration du client PayPal:", error);
  throw error;
}

// Ruta para obtener los detalles de un plan
router.get("/plan/:planType", async (req, res) => {
  console.log("Plan demandé:", req.params.planType);
  const plans = {
    basic: {
      title: "Basic",
      price: "30.00",
      description: "Un plan général pour les débutants.",
      features: ["Accès de base", "Support Limité"],
      color: "orange",
    },
    standard: {
      title: "Standard",
      price: "55.00",
      description: "Un plan avancé avec toutes les fonctionnalités.",
      features: ["Accès complet", "Support standard"],
      color: "blue",
    },
    premium: {
      title: "Premium",
      price: "70.00",
      description: "Un plan avancé avec toutes les fonctionnalités.",
      features: ["Accès complet", "Support premium"],
      color: "red",
    },
  };

  const plan = plans[req.params.planType];
  if (!plan) {
    return res.status(404).json({ error: "Plan non trouvé" });
  }

  res.json({ plan });
});

// Ruta para crear una orden
router.post("/create-order", async (req, res) => {
  try {
    const { planTitle, price } = req.body;
    console.log("Créer l’ordre pour:", { planTitle, price });

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "CAD",
            value: price.toString(), // Asegura que price sea string
          },
          description: `Plan ${planTitle}`,
        },
      ],
    });

    const order = await client.execute(request);
    console.log("Request enviado a PayPal:", request);
    console.log("Ordre créé avec succès:", order.result.id);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error("Erreur détaillée lors de la création de la commande:", {
      message: error.message,
      stack: error.stack,
      details: error.details || "No additional details",
    });
    res.status(500).json({
      error: "Erreur lors de la création de la commande PayPal",
      details: error.message,
    });
  }
});

// Ruta para capturar el pago
router.post("/capture-payment", async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await client.execute(request);

    // Extraer los detalles del pago
    const payment = capture.result;
    const paymentDetails = {
      orderId: payment.id,
      status: payment.status,
      amount: payment.purchase_units[0].payments.captures[0].amount.value,
      currency:
        payment.purchase_units[0].payments.captures[0].amount.currency_code,
      payerEmail: payment.payer.email_address,
      payerName: `${payment.payer.name.given_name} ${payment.payer.name.surname}`,
      createTime: payment.create_time,
      updateTime: payment.update_time,
    };

    res.json({
      status: "success",
      data: paymentDetails,
    });
  } catch (error) {
    console.error("Erreur lors de la saisie du paiement:", error);
    res.status(500).json({
      error: "Erreur lors du traitement du paiement",
      details: error.message,
    });
  }
});
module.exports = router;
