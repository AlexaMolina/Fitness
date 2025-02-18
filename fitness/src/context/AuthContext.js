import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para manejar el usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  // Función para recuperar el usuario autenticado desde el backend
  const fetchAuthenticatedUser = async () => {
    try {
      console.log("Intentando recuperar el usuario autenticado...");
      const response = await fetch("http://localhost:5002/api/auth/answers", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Usuario no autenticado");

      const data = await response.json();
      console.log("Usuario autenticado recuperado:", data);

      setUser({
        ...data.user,
        email: data.user.email, // Email como identificador principal
      });
    } catch (err) {
      console.error("Error al recuperar el usuario autenticado:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAuthenticatedUser(); // Recuperar el usuario al cargar la aplicación
  }, []);

  const login = (userData) => {
    setUser(userData); // Actualizar el usuario al autenticarse
  };

  const logout = async () => {
    try {
      console.log("Intentando cerrar sesión...");
      const response = await fetch("http://localhost:5002/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Sesión cerrada correctamente");
        setUser(null); // Limpiar el estado de usuario
      } else {
        console.error("Error al cerrar sesión:", response.statusText);
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Si aún está cargando, no mostrar los hijos
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
