import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const RecommendationBasic = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener datos del usuario
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/exercises/generate/basic",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user.answers), // Enviar respuestas del usuario
          }
        );
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user.answers]);

  if (loading) return <CircularProgress />;
  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <Card
        style={{
          border: "3px solid orange",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            style={{ color: "orange", textAlign: "center" }}
          >
            Recommandations pour le Plan de Basic
          </Typography>
          <Typography>{recommendations}</Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        style={{
          backgroundColor: "orange",
          color: "white",
          marginTop: "20px",
        }}
        onClick={() => navigate("/results")}
      >
        Résultats
      </Button>
    </div>
  );
};

export default RecommendationBasic;
