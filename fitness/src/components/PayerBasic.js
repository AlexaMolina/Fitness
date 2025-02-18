import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const PayerBasic = () => {
  const { planType } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook de traducción
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `http://localhost:5003/api/payment/plan/${planType}`
        );
        if (!response.ok) {
          throw new Error(t("planNotFound"));
        }
        const data = await response.json();
        setPlan(data.plan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planType, t]);

  const handleApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture(); // Captura el pago
      console.log("Pago exitoso:", order);

      // Almacenar los detalles del pago
      setPaymentDetails({
        orderId: order.id,
        planType: plan.title,
        amount: plan.price,
        date: new Date().toLocaleString(),
        status: "Completado",
      });
    } catch (error) {
      console.error("Error al capturar el pago:", error);
      alert(t("paymentError"));
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!plan) {
    return <Typography>{t("planNotFound")}</Typography>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <Card
        style={{
          border: `3px solid ${plan.color}`,
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <CardContent style={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            style={{
              backgroundColor: plan.color,
              color: "white",
              padding: "10px 0",
              borderRadius: "5px",
            }}
          >
            {plan.title}
          </Typography>

          <Typography
            variant="h4"
            style={{ margin: "20px 0", color: plan.color }}
          >
            ${plan.price} CAD
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            {plan.description}
          </Typography>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {plan.features.map((feature, i) => (
              <li key={i} style={{ marginBottom: "10px" }}>
                {feature}
              </li>
            ))}
          </ul>

          {/* Botones de PayPal */}
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={async () => {
              const response = await fetch(
                "http://localhost:5003/api/payment/create-order",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    planTitle: plan.title,
                    price: plan.price,
                  }),
                }
              );
              const data = await response.json();

              if (!data.id) throw new Error(t("paymentError"));
              return data.id;
            }}
            onApprove={handleApprove}
            onError={(err) => {
              console.error("Error con PayPal:", err);
              alert(t("paymentError"));
            }}
          />
        </CardContent>
      </Card>

      {/* Resumen del Pago */}
      {paymentDetails && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" style={{ color: "#4caf50" }}>
            {t("paymentSuccess")}
          </Typography>
          <Typography>
            <strong>{t("orderId")}:</strong> {paymentDetails.orderId}
          </Typography>
          <Typography>
            <strong>{t("price")}:</strong> ${paymentDetails.amount} CAD
          </Typography>
          <Typography>
            <strong>{t("date")}:</strong> {paymentDetails.date}
          </Typography>
          <Typography>
            <strong>{t("status")}:</strong> {paymentDetails.status}
          </Typography>

          {/* BOTÓN "VAMOS" */}
          <Button
            variant="contained"
            fullWidth
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "15px",
              fontSize: "16px",
              marginTop: "20px",
            }}
            onClick={() => navigate("/recommendation-basic")}
          >
            {t("proceed")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayerBasic;
