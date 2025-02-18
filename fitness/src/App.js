import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Registrer from "./components/Registrer";
import Accueil from "./components/Accueil";
import ProfileCreation from "./components/ProfileCreation";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProfileEdit from "./components/Profile";
import Recommendation from "./components/Recommendation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import RecommendationBasic from "./components/RecommendationBasic";
import RecommendationStandard from "./components/RecommendationStandard";
import RecommendationPremium from "./components/RecommendationPremium";
import PaymentComponent from "./components/PaymentComponent";
import Results from "./components/Results";
import Dashboard from "./components/Dashboard";
import WeeklyResults from "./components/WeeklyResults";
import ChatAI from "./components/ChatAI";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <PayPalScriptProvider
        options={{
          "client-id":
            "AXqtPl70AvbAa3rvBI21R6-5odn063sa0NPevC-Vy7uLEC2LVkSbnRcVCw9Xvy3ag-3UEVo0pdJeuxCg",
          currency: "CAD",
          intent: "capture",
        }}
      >
        <Router>
          <Header />
          <div style={{ minHeight: "calc(100vh - 120px)" }}>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/register" element={<Registrer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/payment/:planType" element={<PaymentComponent />} />
              <Route path="/Results" element={<Results />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/WeeklyResults" element={<WeeklyResults />} />
              <Route path="/ChatIA" element={<ChatAI />} />
              <Route
                path="/recommendation-basic"
                element={<RecommendationBasic />}
              />
              <Route
                path="/recommendation-standard"
                element={<RecommendationStandard />}
              />
              <Route
                path="/recommendation-premium"
                element={<RecommendationPremium />}
              />
              <Route
                path="/profile-creation"
                element={
                  <ProtectedRoute>
                    <ProfileCreation />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<ProfileEdit />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;
