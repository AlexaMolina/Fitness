const express = require("express");
const OpenAI = require("openai");
const User = require("../models/User");

const router = express.Router();

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta para registrar usuario
router.post("/register", async (req, res) => {
  const { name, email, password, age, weight, height, gender } = req.body;

  if (!name || !email || !password || !age || !weight || !height || !gender) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    const newUser = new User({
      name,
      email,
      password,
      age,
      weight,
      height,
      gender,
    });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur enregistré avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement d'un utilisateur:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement d'un utilisateur." });
  }
});

// Ruta para obtener el perfil por email
router.get("/profile/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de l’obtention du profil :", err);
    res.status(500).json({ error: "Erreur lors de l’obtention du profil." });
  }
});

// Ruta para actualizar perfil por email
router.put("/profile/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const updatedUser = await User.findOneAndUpdate({ email }, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil." });
  }
});

// Ruta para guardar respuestas del perfil
router.post("/answers/email/:email", async (req, res) => {
  const { email } = req.params;
  console.log("E-mail reçu:", email);
  console.log("Données reçues dans le corps :", req.body);

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { profile: req.body },
      { new: true }
    );

    if (!user) {
      console.error("Utilisateur non trouvé");
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Réponses Enregistrées.", user });
  } catch (err) {
    console.error("Erreur lors de l’enregistrement des réponses:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de l’enregistrement des réponses." });
  }
});

// Ruta para guardar respuestas del perfil
router.post("/answers/email/:email", async (req, res) => {
  const { email } = req.params;
  console.log("E-mail reçu:", email);
  console.log("Données reçues dans le corps :", req.body);

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { profile: req.body },
      { new: true }
    );

    if (!user) {
      console.error("Utilisateur non trouvé");
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Réponses Enregistrées.", user });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement des réponses:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de l'enregistrement des réponses." });
  }
});

// Ruta para obtener recomendaciones
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
      En tant qu'expert en santé et bien-être, analyse ce profil et recommande le meilleur plan (Basic, Standard ou Premium):

      Profil utilisateur:
      - Niveau d'activité: ${profile.niveauActivite}
      - Heures de sommeil: ${profile.heuresSommeil}
      - Fréquence d'exercice: ${profile.frequenceExercice}
      - Type d'alimentation: ${profile.typeAlimentation}
      - Consommation d'eau: ${profile.consommationEau}
      - Niveau de stress: ${profile.niveauStress}
      - Objectif principal: ${profile.objectif}
      ${
        profile.preferencesExercice
          ? `- Préférences exercice: ${profile.preferencesExercice.join(", ")}`
          : ""
      }
      ${
        profile.restrictionsSante
          ? `- Restrictions santé: ${profile.restrictionsSante.join(", ")}`
          : ""
      }
      ${
        profile.habitudesRepas
          ? `- Habitudes repas: ${profile.habitudesRepas.join(", ")}`
          : ""
      }

      Plans disponibles:
      1. Basic ($30): Plan général pour débutants
      2. Standard ($55): Plan personnalisé avec IA
      3. Premium ($70): Plan 100% personnalisé avec suivi

      Réponds uniquement avec le nom du plan (Basic, Standard ou Premium) sans explication.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu es un expert en santé qui recommande des plans d'entraînement personnalisés.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const recommendation = completion.choices[0].message.content.trim();

    // Validar que la respuesta sea un plan válido
    const validPlans = ["Basic", "Standard", "Premium"];
    if (!validPlans.includes(recommendation)) {
      throw new Error("Plan non valide reçu de l'IA");
    }

    res.status(200).json({ recommendation });
  } catch (err) {
    console.error("Erreur lors de la génération de la recommandation:", err);
    res.status(500).json({
      error: "Erreur lors de la génération de la recommandation.",
      details: err.message,
    });
  }
});

module.exports = router;
