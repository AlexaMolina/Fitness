/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { MessageCircle, CheckCircle, Megaphone } from "lucide-react";
import axios from "axios";
import ChatAI from "./ChatAI";
import { useTranslation } from "react-i18next"; // Add this import

const WeeklyResults = () => {
  const { t } = useTranslation(); // Add translation hook
  const [weeklyData, setWeeklyData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const loadWeeklyData = useCallback(async () => {
    const storedData = JSON.parse(localStorage.getItem("weeklyActivity")) || [];
    setWeeklyData(storedData);

    if (storedData.length > 0) {
      await getAIRecommendations(storedData);
    }
  }, []);

  const getAIRecommendations = async (weeklyResults) => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/recommendations/activity",
        { weeklyResults }
      );

      console.log(
        "📜 Respuesta de la IA en el frontend:",
        response.data.recommendations
      );

      const formattedRecommendations = response.data.recommendations
        .split(/\d+\.\s/)
        .filter((rec) => rec.trim() !== "");

      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error("❌ Error al obtener recomendaciones:", error);
      setRecommendations([t("errorFetchingRecommendations")]);
    }
  };

  useEffect(() => {
    loadWeeklyData();
  }, [loadWeeklyData]);

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", mt: 4, p: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        {t("weeklySummary")}
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#2563eb" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("day")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("time")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("steps")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("calories")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("sleepHours")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weeklyData.length > 0 ? (
              weeklyData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell>{day.date}</TableCell>
                  <TableCell>{day.time}</TableCell>
                  <TableCell>{day.stepsCount}</TableCell>
                  <TableCell>{day.caloriesBurned}</TableCell>
                  <TableCell>{day.sleepHours}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t("noRecordsAvailable")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          mt: 4,
          bgcolor: "#f9f9f9",
          p: 3,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 2,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Megaphone size={24} style={{ marginRight: 8 }} />
            {t("weeklyRecommendations")}
          </Typography>

          {recommendations.length > 0 ? (
            <List>
              {recommendations.map((rec, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ alignItems: "flex-start", pb: 2 }}>
                    <ListItemIcon>
                      <CheckCircle size={24} color="#10b981" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${index + 1}. ${rec}`}
                      sx={{ fontSize: "16px", textAlign: "justify" }}
                    />
                  </ListItem>
                  {index !== recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" textAlign="center">
              {t("loadingRecommendations")}
            </Typography>
          )}
        </CardContent>
      </Card>

      <IconButton
        onClick={() => setChatOpen(!chatOpen)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#2563eb",
          color: "white",
          "&:hover": { backgroundColor: "#1d4ed8" },
        }}
      >
        <MessageCircle size={28} />
      </IconButton>

      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 70,
            right: 20,
            width: 350,
            height: 500,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            zIndex: 1000,
          }}
        >
          <ChatAI />
        </Box>
      )}
    </Box>
  );
};

export default WeeklyResults;
