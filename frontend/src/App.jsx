import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-10 text-purple-400" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
      </Routes>
    </div>
  )
}

export default App