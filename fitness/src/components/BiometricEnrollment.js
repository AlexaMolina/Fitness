import React from "react";
import { startRegistration } from "@simplewebauthn/browser";

const BiometricEnrollment = () => {
  const handleBiometricRegistration = async () => {
    try {
      const attestationResponse = await startRegistration({
        // Aquí deberías pasar la configuración necesaria desde tu backend
      });
      console.log("Biometric Registration Successful:", attestationResponse);
      alert("Inscripción biométrica exitosa");
    } catch (error) {
      console.error("Error en la inscripción biométrica:", error);
      alert("Error durante la inscripción biométrica");
    }
  };

  return (
    <button onClick={handleBiometricRegistration}>
      Inscribirse con Huella
    </button>
  );
};

export default BiometricEnrollment;
