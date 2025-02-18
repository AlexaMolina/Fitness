import React from "react";
import "../styles/Accueil.css";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Accueil = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const plans = [
    {
      title: "Basic",
      price: "$30",
      description: "Un plan général pour commencer.",
      features: [
        "Répondez à des questions de base",
        "Obtenez une routine d'entraînement générale",
        "Idéal pour les débutants",
      ],
      color: "orange",
      onClick: () => navigate("/register"),
    },
    {
      title: "Standard",
      price: "$55",
      description: "Un plan personnalisé avec IA.",
      features: [
        "Répondez à des questions spécifiques",
        "Exercices personnalisés grâce à l'IA",
        "Suivi adapté à vos besoins",
      ],
      color: "blue",
      onClick: () => navigate("/register"),
    },
    {
      title: "Premium",
      price: "$70",
      description: "Tout inclus, 100% personnalisé.",
      features: [
        "Répondez à des questions détaillées",
        "Exercices personnalisés avec IA",
        "Régime alimentaire personnalisé avec IA",
      ],
      color: "red",
      onClick: () => navigate("/register"),
    },
  ];

  return (
    <div className="accueil-container">
      {/* Video de fondo */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        src="/27088-361827441_small.mp4" // Ruta del video
        type="video/mp4"
      ></video>

      {/* Contenido principal */}
      <Container style={{ position: "relative", zIndex: 2, marginTop: "50px" }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "800",
            background: "linear-gradient(to right,#87CEEB, #DD2476)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "black",
          }}
        >
          {t("welcome")}
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {t("homeSubtitle")}
        </Typography>

        <Typography
          variant="h6"
          align="center"
          style={{ marginBottom: "30px", color: "white" }}
        >
          {t("homeSubtitle1")}
        </Typography>

        <div className="plans-section">
          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card
                  style={{
                    border: `3px solid ${plan.color}`,
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ marginBottom: "10px" }}
                    >
                      {plan.description}
                    </Typography>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{ marginBottom: "10px" }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: plan.color,
                        color: "white",
                        marginTop: "10px",
                      }}
                      onClick={plan.onClick}
                    >
                      {t("signUp")}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default Accueil;
