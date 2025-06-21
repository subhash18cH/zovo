import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"; // Add this import
import logo from "/src/assets/zovo.png"
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import community from "/src/assets/community.jpg";
import { MdOutlineMailOutline } from "react-icons/md";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const { getUsers } = useChatStore(); // Add this

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Await the login to complete
    const result = await login(formData);

    // If login was successful, fetch users
    if (result?.success) {
      console.log("Login successful, fetching users...");
      await getUsers();
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 mt-10">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img src={logo} alt="Zovo logo" className="size-12" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                Welcome Back
              </h1>
              <p className="text-base-content/60">
                Sign in to your account
              </p>
            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  required
                  type="email"
                  className={`text-sm h-10 bg-base-100 border border-gray-100/30 rounded-md w-full pl-10`}
                  placeholder="joe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className={`text-sm h-10 bg-base-100 border border-gray-100/30 rounded-md w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-screen text-center">
          <img src={community} alt="community image" className="mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join our community</h2>
          <p className="text-base-content/60">Build connections, share moments, and stay engaged.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;