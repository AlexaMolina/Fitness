import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Recommendation = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5003/api/users/recommendations/email/${user.email}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t("errorFetching"));
        }

        const data = await response.json();
        setRecommendation(data.recommendation);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchRecommendation();
    }
  }, [user?.email, t]);

  const plans = [
    {
      title: t("plans.basic.title"),
      price: t("plans.basic.price"),
      description: t("plans.basic.description"),
      features: t("plans.basic.features", { returnObjects: true }),
      color: "orange",
      onClick: () => navigate("/payment/basic"),
    },
    {
      title: t("plans.standard.title"),
      price: t("plans.standard.price"),
      description: t("plans.standard.description"),
      features: t("plans.standard.features", { returnObjects: true }),
      color: "blue",
      onClick: () => navigate("/payment/standard"),
    },
    {
      title: t("plans.premium.title"),
      price: t("plans.premium.price"),
      description: t("plans.premium.description"),
      features: t("plans.premium.features", { returnObjects: true }),
      color: "red",
      onClick: () => navigate("/payment/premium"),
    },
  ];

  const renderPlanCard = (plan, index) => (
    <Grid item xs={12} md={4} key={index}>
      <Card
        sx={{
          border: `3px solid ${plan.color}`,
          borderRadius: "10px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography
              variant="h5"
              sx={{
                backgroundColor: plan.color,
                color: "white",
                padding: "10px 0",
                borderRadius: "5px",
                marginBottom: 2,
              }}
            >
              {plan.title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                margin: "20px 0",
                color: plan.color,
                fontWeight: "bold",
              }}
            >
              {plan.price}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                marginBottom: 2,
                minHeight: "48px",
              }}
            >
              {plan.description}
            </Typography>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "20px 0",
              }}
            >
              {plan.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: "10px" }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="contained"
            sx={{
              backgroundColor: plan.color,
              color: "white",
              marginTop: "auto",
              "&:hover": {
                backgroundColor: plan.color,
                opacity: 0.9,
              },
            }}
            onClick={plan.onClick}
            fullWidth
          >
            {t("plans.basic.choose")}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography>{t("loading")}</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography
          variant="h6"
          color="error"
          align="center"
          sx={{ marginTop: 4 }}
        >
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ display: "block", margin: "20px auto" }}
          onClick={() => window.location.reload()}
        >
          {t("retry")}
        </Button>
      </Container>
    );
  }

  const highlightRecommendedPlan = (plans) => {
    return plans.map((plan) => ({
      ...plan,
      isRecommended: plan.title === recommendation,
    }));
  };

  const plansWithRecommendation = highlightRecommendedPlan(plans);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginBottom: 3,
          fontWeight: "bold",
        }}
      >
        {t("recommendationTitle")}
      </Typography>

      {recommendation && (
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: "green",
            marginBottom: 5,
            fontWeight: "bold",
          }}
        >
          {t("recommendedPlan", { plan: recommendation })}
        </Typography>
      )}

      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
        {plansWithRecommendation.map((plan, index) =>
          renderPlanCard(plan, index)
        )}
      </Grid>
    </Container>
  );
};

export default Recommendation;
