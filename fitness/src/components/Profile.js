import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    age: "",
    poids: "",
    taille: "",
    sexe: "",
  });
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5003/api/users/profile/email/${user.email}`
        );
        if (!response.ok)
          throw new Error("Error al cargar los datos del usuario.");
        const data = await response.json();
        setFormData({
          nom: data.name,
          email: data.email,
          age: data.age,
          poids: data.weight,
          taille: data.height,
          sexe: data.gender,
        });
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del usuario.");
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name: formData.nom,
      email: formData.email,
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.poids),
      height: parseFloat(formData.taille),
      gender: formData.sexe,
    };

    try {
      const response = await fetch(
        `http://localhost:5003/api/users/profile/email/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil.");
      }

      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      alert("Perfil actualizado exitosamente.");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      alert("Error al actualizar el perfil.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Modifier le Profil
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" align="center">
          {success}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nom"
          name="nom"
          margin="normal"
          value={formData.nom}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Adresse e-mail"
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          disabled // El email no debería ser editable
        />
        <TextField
          fullWidth
          label="Âge"
          name="age"
          type="number"
          margin="normal"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Poids (kg)"
          name="poids"
          type="number"
          margin="normal"
          value={formData.poids}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Taille (cm)"
          name="taille"
          type="number"
          margin="normal"
          value={formData.taille}
          onChange={handleChange}
        />
        <TextField
          select
          fullWidth
          label="Sexe"
          name="sexe"
          margin="normal"
          value={formData.sexe}
          onChange={handleChange}
        >
          <MenuItem value="Femme">Femme</MenuItem>
          <MenuItem value="Homme">Homme</MenuItem>
          <MenuItem value="Autre">Autre</MenuItem>
        </TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Sauvegarder
        </Button>
      </form>
    </Container>
  );
};

export default Profile;
