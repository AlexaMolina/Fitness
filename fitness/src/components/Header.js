import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "@mui/material";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirige al inicio después de cerrar sesión
    window.location.reload(); // Fuerza una recarga completa para limpiar el estado
  };

  useEffect(() => {
    console.log("Estado de usuario actualizado:", user);
  }, [user]); // Actualizar el encabezado cuando el estado de usuario cambie

  // Estado para el menú de idiomas
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Función para cambiar de idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleMenuClose(); // Cerrar menú después de cambiar el idioma
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img
            src="/logoStage.JPG"
            alt="Logo"
            style={{ width: "90px", height: "90px", marginRight: "10px" }}
          />
          <Typography
            variant="h4"
            style={{
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "800",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "black",
            }}
          >
            FitnessApp
          </Typography>
        </div>

        {/* Menú de idiomas */}
        <Button
          onClick={handleMenuOpen}
          style={{ color: "white", marginRight: "10px" }}
        >
          🌍 {t("language")}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
          <MenuItem onClick={() => changeLanguage("fr")}>🇫🇷 Français</MenuItem>
          <MenuItem onClick={() => changeLanguage("es")}>🇪🇸 Español</MenuItem>
        </Menu>

        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/profile")}>
                {t("profile")}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/")}>
                {t("home")}
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                {t("register")}
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                {t("login")}
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
