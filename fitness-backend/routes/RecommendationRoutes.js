const express = require("express");
const OpenAI = require("openai");
const User = require("../models/User");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get("/recommendations/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.profile) {
      return res
        .status(404)
        .json({ error: "Utilisateur introuvable ou profil incomplet." });
    }

    const profile = user.profile;

    const prompt = `
      Je suis un expert en santé et fitness. Analyse ce profil d'utilisateur et recommande le meilleur plan (Basic, Standard ou Premium) basé sur ses besoins:

      Profil:
      - Niveau d'activité: ${profile.niveauActivite}
      - Sommeil: ${profile.heuresSommeil}
      - Fréquence d'exercice: ${profile.frequenceExercice}
      - Alimentation: ${profile.typeAlimentation}
      - Eau par jour: ${profile.consommationEau}
      - Stress: ${profile.niveauStress}
      - Objectif: ${profile.objectif}
      - Exercices préférés: ${profile.preferencesExercice?.join(", ")}
      - Restrictions santé: ${profile.restrictionsSante?.join(", ")}
      - Habitudes repas: ${profile.habitudesRepas?.join(", ")}
      - Soutien famille: ${profile.soutienFamille?.join(", ")}

      Plans disponibles:
      1. Basic ($30): Plan général pour débutants. Routines d'entraînement basiques.
      2. Standard ($55): Plan personnalisé avec IA. Exercices adaptés.
      3. Premium ($70): Plan 100% personnalisé avec régime alimentaire et suivi avancé.

      Réponds uniquement avec le nom du plan (Basic, Standard ou Premium) sans explication.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en santé et fitness qui recommande des plans d'entraînement personnalisés.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 100, // Limitamos la respuesta para obtener solo el nombre del plan
    });

    const recommendation = completion.choices[0].message.content.trim();

    // Validamos que la respuesta sea uno de los planes válidos
    const validPlans = ["Basic", "Standard", "Premium"];
    if (!validPlans.includes(recommendation)) {
      return res.status(500).json({ error: "Erreur de recommandation." });
    }

    res.status(200).json({ recommendation });
  } catch (err) {
    console.error("Erreur lors de la génération de la recommandation:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération de la recommandation." });
  }
});

router.post("/activity", async (req, res) => {
  const { weeklyResults, language = "fr" } = req.body; // Por defecto en francés

  try {
    const avgSteps =
      weeklyResults.reduce((sum, d) => sum + d.stepsCount, 0) /
      weeklyResults.length;
    const avgCalories =
      weeklyResults.reduce((sum, d) => sum + d.caloriesBurned, 0) /
      weeklyResults.length;
    const avgSleep =
      weeklyResults.reduce((sum, d) => sum + d.sleepHours, 0) /
      weeklyResults.length;

    const prompt = `
   Je suis un coach de fitness professionnel. Basé sur ces données d'activité hebdomadaire, génère **3 recommandations** en **${language}** pour améliorer la santé de l'utilisateur :

    - **Pas quotidiens** : ${avgSteps.toFixed(0)}
    - **Calories brûlées** : ${avgCalories.toFixed(0)}
    - **Heures de sommeil** : ${avgSleep.toFixed(1)}

    Réponds uniquement en **${language}** avec **3 conseils clairs et détaillés**.
  `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Tu es un entraîneur de fitness expérimenté. Réponds uniquement en français avec des recommandations claires.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res
      .status(200)
      .json({ recommendations: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Erreur lors de l'obtention des recommandations:", err);
    res.status(500).json({
      error: "Erreur lors de l'obtention des recommandations de l'IA.",
    });
  }
});

module.exports = router;
