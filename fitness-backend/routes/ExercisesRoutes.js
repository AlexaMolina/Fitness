const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Características específicas por plan
const planFeatures = {
  basic: {
    maxExercises: 5,
    includesDiet: false,
    includesDetailedPlan: false,
    promptExtras: "Generate a basic general exercise plan.",
  },
  standard: {
    maxExercises: 10,
    includesDiet: true,
    includesDetailedPlan: false,
    promptExtras: "Generate a personalized exercise plan and basic diet.",
  },
  premium: {
    maxExercises: 15,
    includesDiet: true,
    includesDetailedPlan: true,
    promptExtras:
      "Generate a detailed and fully customized plan of exercises and nutrition.",
  },
};

// Función para generar el prompt según el plan
const generatePrompt = (planType, userAnswers) => {
  const features = planFeatures[planType];
  const {
    niveauActivite,
    heuresSommeil,
    frequenceExercice,
    typeAlimentation,
    consommationEau,
    niveauStress,
    objectif,
    preferencesExercice,
    restrictionsSante,
    habitudesRepas,
    soutienFamille,
  } = userAnswers;

  let prompt = `
    Vous êtes un coach personnel et diététicien expert. 
    ${features.promptExtras}
    
    PROFIL DE L’UTILISATEUR :
    🔹 Niveau d’activité : ${niveauActivite}
    🔹 Heures de sommeil : ${heuresSommeil}
    🔹 Fréquence de l’exercice actuel : ${frequenceExercice}
    🔹 Type d’alimentation : ${typeAlimentation}
    🔹 Consommation d'eau: ${consommationEau}
    🔹 Niveau de stress ${niveauStress}
    🔹 Objectif principal: ${objectif}
    🔹 Préférences d’exercice : ${
      Array.isArray(preferencesExercice)
        ? preferencesExercice.join(", ")
        : "Aucun"
    }
    🔹 Restrictions de Santé: ${
      Array.isArray(restrictionsSante) ? restrictionsSante.join(", ") : "Aucun"
    }
    🔹 Habitudes Alimentaires: ${
      Array.isArray(habitudesRepas) ? habitudesRepas.join(", ") : "Non Spécifié"
    }
    🔹 Soutien Familial: ${
      Array.isArray(soutienFamille) ? soutienFamille.join(", ") : "Non Spécifié"
    }

    INSTRUCTIONS SPÉCIFIQUES SELON LE PLAN ${planType.toUpperCase()}:
    1. Fournit la plus grande ${features.maxExercises} exercices spécifiques.
    ${
      features.includesDiet
        ? "2. Comprend un plan alimentaire personnalisé."
        : ""
    }
    ${
      features.includesDetailedPlan
        ? "3. Ajoutez des détails spécifiques de séries, de répétitions et de technique pour chaque exercice."
        : ""
    }
    ${
      planType === "premium"
        ? "4. Comprend des recommandations supplémentaires pour la supplémentation et la récupération."
        : ""
    }

    FORMAT DE RÉPONSE:
    1. PLAN D’EXERCICE:
    [Liste détaillée des exercices par niveau de plan]

    ${
      features.includesDiet
        ? `2. PLAN D’ALIMENTATION :
    [Plan détaillé selon les contraintes et les objectifs]`
        : ""
    }

    ${
      features.includesDetailedPlan
        ? `3. RECOMMANDATIONS SUPPLÉMENTAIRES
    [Détails spécifiques de la mise en œuvre]`
        : ""
    }
  `;

  return prompt;
};

router.post("/generate/:planType", async (req, res) => {
  const { planType } = req.params;
  const userAnswers = req.body;

  if (!planFeatures[planType]) {
    return res.status(400).json({ error: "Plan non valide" });
  }

  try {
    const prompt = generatePrompt(planType, userAnswers);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un entraîneur et diététicien expert spécialisé dans les plans personnalisés.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      recommendations: response.data.choices[0].message.content,
      planType: planType,
    });
  } catch (error) {
    console.error("Error en OpenAI API:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la génération des recommandations" });
  }
});

module.exports = router;
