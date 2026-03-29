import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorGlow from "./components/CursorGlow";
import ToastContainer from "./components/ToastContainer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FavouritesPage from "./pages/FavouritesPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AnimatedBackground />
      <CursorGlow />
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
