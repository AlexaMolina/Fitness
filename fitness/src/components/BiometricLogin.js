import React from "react";
import { View, Button, Alert } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import SInfo from "react-native-sensitive-info";
import auth from "@react-native-firebase/auth";

const BiometricLogin = () => {
  const handleBiometricLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();

    const { available } = await rnBiometrics.isSensorAvailable();
    if (available) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: "Confirma tu identidad",
      });

      if (success) {
        const firebaseToken = await SInfo.getItem("firebaseToken", {
          sharedPreferencesName: "myAppPrefs",
          keychainService: "myAppKeychain",
        });

        if (firebaseToken) {
          // Verifica el token con Firebase
          const userCredential = await auth().signInWithCustomToken(
            firebaseToken
          );
          Alert.alert(
            "Inicio de sesión exitoso",
            `Bienvenido ${userCredential.user.email}`
          );
        } else {
          Alert.alert(
            "No se encontró un token. Por favor, inscríbete primero."
          );
        }
      } else {
        Alert.alert("Autenticación biométrica fallida");
      }
    } else {
      Alert.alert("Biometría no disponible en este dispositivo");
    }
  };

  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <Button
        title="Iniciar sesión con huella"
        onPress={handleBiometricLogin}
      />
    </View>
  );
};

export default BiometricLogin;
