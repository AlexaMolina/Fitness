const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  gender: { type: String, enum: ["Homme", "Femme", "Autre"], required: true },
  createdAt: { type: Date, default: Date.now },
  profile: {
    niveauActivite: { type: String },
    heuresSommeil: { type: String },
    frequenceExercice: { type: String },
    preferencesExercice: { type: [String] },
    restrictionsSante: { type: [String] },
    typeAlimentation: { type: String },
    consommationEau: { type: String },
    niveauStress: { type: String },
    supplements: { type: Boolean, default: false },
    tempsDisponible: { type: String },
    objectif: { type: String },
    allergies: { type: String },
    habitudesRepas: { type: [String] },
    soutienFamille: { type: [String] }, // Ahora acepta múltiples valores
    tempsRepos: { type: String },
    intensiteExercice: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);
