import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import logo from "/src/assets/zovo.png"
import { Link } from "react-router-dom";
import community from "/src/assets/community.jpg";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 mt-8">

      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img src={logo} alt="Zovo logo" className="size-12" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                Create Account
              </h1>
            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="form-control">
              <label htmlFor="fullName" className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRegUser className="size-5 text-base-content/40" />
                </div>
                <input
                  required
                  id="fullName"
                  type="text"
                  className={`text-sm h-10 bg-base-100 border border-gray-100/30 rounded-md  w-full pl-10`}
                  placeholder="Joe Root"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  required
                  id="email"
                  type="email"
                  className={`text-sm h-10 bg-base-100 border border-gray-100/30 rounded-md w-full pl-10`}
                  placeholder="joe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>


            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/10" />
                </div>
                <input
                  required
                  id="password"
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
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>


            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
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
  )
}
export default Signup