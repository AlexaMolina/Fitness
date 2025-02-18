import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Container,
  MenuItem,
  TextField,
  Button,
  Select,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileCreation = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    niveauActivite: "",
    autreNiveauActivite: "",
    heuresSommeil: "",
    autreHeuresSommeil: "",
    frequenceExercice: "",
    autreFrequenceExercice: "",
    typeAlimentation: "",
    autreTypeAlimentation: "",
    consommationEau: "",
    autreConsommationEau: "",
    niveauStress: "",
    autreNiveauStress: "",
    supplements: false,
    objectif: "",
    autreObjectif: "",
    preferencesExercice: [],
    autrePreferencesExercice: "",
    restrictionsSante: [],
    autreRestrictionsSante: "",
    habitudesRepas: [],
    autreHabitudesRepas: "",
    soutienFamille: [],
    autreSoutienFamille: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultipleChange = (name, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value.includes("Autre") ? [...value, ""] : value,
    }));
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(profileData)) {
      if (
        key !== "supplements" &&
        key.startsWith("autre") &&
        profileData[key.replace("autre", "")]?.includes("Autre") &&
        !value
      ) {
        return t("errorRequired");
      }

      if (key !== "supplements" && !value && !key.startsWith("autre")) {
        return t("errorRequired");
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    console.log("Datos enviados al servidor:", profileData);

    const requestData = {
      userId: user.id,
      ...profileData,
      soutienFamille: Array.isArray(profileData.soutienFamille)
        ? [
            ...profileData.soutienFamille,
            profileData.autreSoutienFamille || null,
          ].filter(Boolean)
        : profileData.soutienFamille,
    };

    try {
      const response = await fetch(
        `http://localhost:5003/api/users/answers/email/${user.email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("Error al guardar las respuestas.");
      const data = await response.json();
      navigate(`/recommendation?plan=${data.recommendedPlan}`);
      navigate("/recommendation");
    } catch (err) {
      console.error("Error al enviar las respuestas:", err);
      alert("Hubo un problema al enviar tus respuestas. Intenta de nuevo.");
    }
  };

  const singleChoiceQuestions = [
    {
      label: t("activityLevel"),
      name: "niveauActivite",
      autreName: "autreNiveauActivite",
      options: [t("sedentary"), t("moderate"), t("active")],
    },
    {
      label: t("sleepHours"),
      name: "heuresSommeil",
      autreName: "autreHeuresSommeil",
      options: [t("lessThan5"), t("between5And7"), t("moreThan7")],
    },
    {
      label: t("exerciseFrequency"),
      name: "frequenceExercice",
      autreName: "autreFrequenceExercice",
      options: [t("rarely"), t("oneToTwoTimes"), t("moreThanThree")],
    },
    {
      label: t("dietType"),
      name: "typeAlimentation",
      autreName: "autreTypeAlimentation",
      options: [t("vegetarian"), t("vegan"), t("omnivore")],
    },
    {
      label: t("waterConsumption"),
      name: "consommationEau",
      autreName: "autreConsommationEau",
      options: [t("lessThan1"), t("between1And2"), t("moreThan2")],
    },
    {
      label: t("stressLevel"),
      name: "niveauStress",
      autreName: "autreNiveauStress",
      options: [t("low"), t("moderateStress"), t("high")],
    },
    {
      label: t("mainGoal"),
      name: "objectif",
      autreName: "autreObjectif",
      options: [t("weightLoss"), t("muscleGain"), t("betterHealth")],
    },
  ];

  const multipleChoiceQuestions = [
    {
      label: t("exercisePreferences"),
      name: "preferencesExercice",
      autreName: "autrePreferencesExercice",
      options: [t("running"), t("swimming"), t("yoga")],
    },
    {
      label: t("healthRestrictions"),
      name: "restrictionsSante",
      autreName: "autreRestrictionsSante",
      options: [t("cardiac"), t("respiratory"), t("diabetes")],
    },
    {
      label: t("eatingHabits"),
      name: "habitudesRepas",
      autreName: "autreHabitudesRepas",
      options: [t("regular"), t("fastFood"), t("lateEating")],
    },
    {
      label: t("familySupport"),
      name: "soutienFamille",
      autreName: "autreSoutienFamille",
      options: [t("yes"), t("no"), t("sometimes")],
    },
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        {t("profileWelcome", { name: user?.name || "Gabi" })}
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        {t("profileInstructions")}
      </Typography>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {singleChoiceQuestions.map(({ label, name, autreName, options }) => (
            <React.Fragment key={name}>
              <TextField
                select
                fullWidth
                label={label}
                name={name}
                value={profileData[name]}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
                <MenuItem value="Autre">Autre</MenuItem>
              </TextField>
              {profileData[name] === "Autre" && (
                <TextField
                  fullWidth
                  label="Veuillez spécifier"
                  name={autreName}
                  value={profileData[autreName]}
                  onChange={handleChange}
                />
              )}
            </React.Fragment>
          ))}

          {multipleChoiceQuestions.map(
            ({ label, name, autreName, options }) => (
              <React.Fragment key={name}>
                <Typography variant="h6" gutterBottom>
                  {label}
                </Typography>
                <Select
                  multiple
                  fullWidth
                  name={name}
                  value={profileData[name]}
                  onChange={(e) => handleMultipleChange(name, e.target.value)}
                  renderValue={(selected) => (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                    >
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>

                {profileData[name].includes("Autre") && (
                  <TextField
                    fullWidth
                    label="Veuillez spécifier"
                    name={autreName}
                    value={profileData[autreName]}
                    onChange={handleChange}
                    style={{ marginTop: "10px" }}
                  />
                )}
              </React.Fragment>
            )
          )}
        </div>

        <Button type="submit" variant="contained" color="primary">
          {t("saveProfile")}
        </Button>
      </form>
    </Container>
  );
};

export default ProfileCreation;
