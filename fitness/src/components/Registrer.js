import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importar i18next
import "../styles/Registrer.css";

const Register = () => {
  const { t } = useTranslation(); // Hook de traducción
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    age: "",
    poids: "",
    taille: "",
    sexe: "Femme",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.email || !formData.password) {
      setError(t("errorRequired"));
      return;
    }

    const payload = {
      name: formData.nom,
      email: formData.email,
      password: formData.password,
      age: formData.age,
      weight: formData.poids,
      height: formData.taille,
      gender: formData.sexe,
    };

    try {
      const response = await fetch("http://localhost:5003/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status === 201) {
        setSuccess(t("successMessage"));
        setError("");
        navigate("/login");
      } else {
        setError(data.error || "Error al registrar usuario.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Error al registrar usuario. Por favor, inténtalo de nuevo.");
      setSuccess("");
    }
  };

  return (
    <Container className="container">
      <Typography variant="h4" align="center" gutterBottom>
        {t("registerTitle")}
      </Typography>

      {error && (
        <Typography variant="body1" align="center" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {success && (
        <Typography variant="body1" align="center" color="success" gutterBottom>
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t("name")}
          name="nom"
          margin="normal"
          value={formData.nom}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("email")}
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("password")}
          type="password"
          name="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("age")}
          name="age"
          type="number"
          margin="normal"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("weight")}
          name="poids"
          type="number"
          margin="normal"
          value={formData.poids}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("height")}
          name="taille"
          type="number"
          margin="normal"
          value={formData.taille}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          label={t("gender")}
          name="sexe"
          margin="normal"
          value={formData.sexe}
          onChange={handleChange}
        >
          <MenuItem value="Femme">{t("female")}</MenuItem>
          <MenuItem value="Homme">{t("male")}</MenuItem>
          <MenuItem value="Autre">{t("other")}</MenuItem>
        </TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          {t("submit")}
        </Button>
      </form>
    </Container>
  );
};

export default Register;
