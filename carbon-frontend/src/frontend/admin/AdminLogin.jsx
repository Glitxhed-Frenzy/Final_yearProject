// src/frontend/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, Shield, Eye, EyeOff, Leaf, Mail, AlertCircle } from "lucide-react";
import { authAPI } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate email domain (only Gmail, Yahoo, Outlook)
  const validateEmailDomain = (email) => {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side email domain validation
    if (!validateEmailDomain(credentials.email)) {
      setError("Only Gmail, Yahoo, and Outlook email addresses are allowed for admin access.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      
      const { token, user } = response.data;
      
      // Check if user has admin role
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Double-check email domain on client side
      if (!validateEmailDomain(user.email)) {
        throw new Error('Invalid admin email domain. Only Gmail, Yahoo, and Outlook allowed.');
      }
      
      // Store tokens
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("adminAuth", "true");
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="absolute inset-0 bg-grid-green-500/[0.03] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-lg border border-green-100">
            <Leaf className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Secure access for administrators</p>
          <p className="text-green-600 text-xs mt-1">Only @gmail.com, @yahoo.com, @outlook.com allowed</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Allowed domains: @gmail.com, @yahoo.com, @outlook.com
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link to="/admin/forgot-password" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              This area is restricted to authorized personnel only.
              <br />Only Gmail, Yahoo, and Outlook email addresses are permitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}