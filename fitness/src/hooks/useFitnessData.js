import { useState, useEffect, useCallback } from "react";

export const useFitnessData = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos del backend
  const fetchFitnessData = useCallback(async () => {
    try {
      setLoading(true); // Inicia el estado de carga

      const response = await fetch("http://localhost:5003/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail") || "user@example.com",
          plan: "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data); // Verifica los datos
      setFitnessData(data); // Actualiza el estado con los datos recibidos
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError(err.message); // Guarda el error
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }, []); // No tiene dependencias porque no necesita otras variables externas

  // Llamada inicial para cargar los datos
  useEffect(() => {
    fetchFitnessData();
  }, [fetchFitnessData]);

  // Retorna los datos, el estado de carga y el error
  return { fitnessData, loading, error };
};
