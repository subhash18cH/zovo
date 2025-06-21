import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div data-theme={theme} >
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Navbar />
      <Routes>
        {/* Public routes - redirect to home if already authenticated */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <Signup />}
        />

        {/* Protected routes - redirect to login if not authenticated */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>


  );
};

export default App;