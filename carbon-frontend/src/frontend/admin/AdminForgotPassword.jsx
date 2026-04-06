// src/frontend/admin/AdminForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Leaf, ArrowLeft, Shield } from "lucide-react";
import { authAPI } from '../../services/api';

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasNumber: false,
    hasUpper: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasLength: password.length >= 6,
      hasNumber: /[0-9]/.test(password),
      hasUpper: /[A-Z]/.test(password)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your admin email address");
      setIsLoading(false);
      return;
    }

    // Validate email domain for admin
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      setError("Admin email must be from Gmail, Yahoo, or Outlook");
      setIsLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.verifyAndReset({
        email,
        newPassword,
        confirmPassword
      });
      
      setSuccess(true);
      
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    const { hasLength, hasNumber, hasUpper } = passwordStrength;
    const count = [hasLength, hasNumber, hasUpper].filter(Boolean).length;
    if (count === 3) return "bg-green-500";
    if (count === 2) return "bg-yellow-500";
    if (count === 1) return "bg-orange-500";
    return "bg-red-500";
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-green-200 mb-6">
              Your admin password has been changed.
              <br />
              Please login with your new password.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              Go to Admin Login
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Password Reset
          </h1>
          <p className="text-green-200">
            Reset your admin account password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="admin@gmail.com"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-green-300/60 mt-2">
                Only Gmail, Yahoo, and Outlook email addresses are allowed
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {newPassword && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(Object.values(passwordStrength).filter(Boolean).length / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Admin Password"
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}