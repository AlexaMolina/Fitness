import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { startAuthentication } from "@simplewebauthn/browser";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next"; // Importar i18next
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../config/FirebaseConfig";

const Login = () => {
  const { t } = useTranslation(); // Hook de traducción
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async (user) => {
    login({
      id: user.uid || user.id,
      email: user.email,
      name: user.displayName || user.name,
    });
    navigate("/profile-creation");
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Usuario autenticado con Google:", user);

      if (!user.email || !user.uid) {
        console.error("El usuario autenticado no tiene email o UID.");
        return;
      }

      handleLogin({
        id: user.uid,
        email: user.email,
        name: user.displayName,
      });
    } catch (error) {
      console.error("Error al autenticar con Google:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Usuario autenticado con Facebook:", result.user);
      handleLogin(result.user);
    } catch (error) {
      console.error("Error al autenticar con Facebook:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", { email, password });
    handleLogin({ email });
  };

  const handleBiometricLogin = async () => {
    try {
      const assertionResponse = await startAuthentication();
      console.log("Autenticación biométrica exitosa:", assertionResponse);
      handleLogin({ email: "biometric@auth.com" });
    } catch (error) {
      console.error("Error en la autenticación biométrica:", error);
    }
  };

  return (
    <Container className="container">
      <Typography variant="h4" align="center" gutterBottom>
        {t("loginTitle")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t("email1")}
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label={t("password1")}
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          {t("signIn")}
        </Button>
      </form>

      <Typography align="center" style={{ marginTop: "20px" }}>
        {t("orLoginWith")}
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Button
          variant="contained"
          color="white"
          onClick={handleGoogleLogin}
          style={{
            margin: "0 10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google Logo"
            style={{ width: "20px", height: "20px" }}
          />
          {t("google")}
        </Button>
        <Button
          variant="contained"
          color="white"
          onClick={handleFacebookLogin}
          style={{
            margin: "0 10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook Logo"
            style={{ width: "20px", height: "20px" }}
          />
          {t("facebook")}
        </Button>
      </div>

      <Typography align="center" style={{ marginTop: "20px" }}>
        {t("orLoginWithFingerprint")}
      </Typography>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBiometricLogin}
          style={{
            margin: "0 10px",
          }}
        >
          {t("fingerprint")}
        </Button>
      </div>
    </Container>
  );
};

export default Login;
