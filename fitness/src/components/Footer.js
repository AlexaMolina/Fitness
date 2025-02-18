import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      style={{
        padding: "20px",
        backgroundColor: "#f1f1f1",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; {new Date().getFullYear()} FitnessApp. Tous droits réservés.
      </Typography>
    </Box>
  );
};

export default Footer;
