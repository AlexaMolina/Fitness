const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "El email es requerido" });
    }

    // Generar datos de ejemplo más realistas
    const currentDate = new Date();
    const fitnessData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        steps: Math.floor(Math.random() * (12000 - 6000) + 6000),
        calories: Math.floor(Math.random() * (600 - 300) + 300),
      };
    }).reverse();

    // Calcular métricas
    const completedWorkouts = Math.floor(Math.random() * 10) + 5;
    const totalWorkouts = 30;
    const consistencyRate = ((completedWorkouts / totalWorkouts) * 100).toFixed(
      1
    );

    // Generar recomendaciones personalizadas
    const response = {
      activityData: fitnessData,
      completedWorkouts,
      totalWorkouts,
      consistencyRate,
      recommendations: {
        general:
          "Mantén un ritmo constante de actividad física. Tu progreso es notable.",
        workout:
          "Incrementa gradualmente la intensidad de tus ejercicios. Considera agregar una sesión adicional por semana.",
        nutrition:
          "Mantén una dieta balanceada y asegúrate de hidratarte adecuadamente durante el día.",
        recovery:
          "Asegúrate de descansar lo suficiente entre sesiones y practica ejercicios de estiramiento.",
      },
    };

    // Guardar en la base de datos
    const result = new Result({
      email,
      ...response,
    });
    await result.save();

    res.json(response);
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
