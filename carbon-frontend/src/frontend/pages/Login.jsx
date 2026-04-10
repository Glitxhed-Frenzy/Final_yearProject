// src/frontend/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail,
  Lock, 
  Eye, 
  EyeOff, 
  Leaf,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { authAPI } from '../../services/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  // Load remembered email and check if Remember Me was active
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberMeFlag = localStorage.getItem("rememberMe");
    
    if (rememberedEmail && rememberMeFlag === "true") {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation with domain restrictions
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 50) {
      newErrors.email = "Email must be less than 50 characters";
    } else {
      // Check allowed domains
      const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
      const domain = formData.email.split('@')[1]?.toLowerCase();
      
      if (!allowedDomains.includes(domain)) {
        newErrors.email = "Only Gmail, Yahoo, and Outlook email addresses are allowed";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 20) {
      newErrors.password = "Password must be less than 20 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (loginError) setLoginError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      email: true,
      password: true
    });

    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // If Remember Me is checked, store flags to keep logged in
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }
      
      // Verify and navigate
      const verifyUser = localStorage.getItem("user");
      const verifyToken = localStorage.getItem("token");
      
      if (verifyUser && verifyToken) {
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setTimeout(() => {
          const retryUser = localStorage.getItem("user");
          const retryToken = localStorage.getItem("token");
          
          if (retryUser && retryToken) {
            navigate("/dashboard");
          } else {
            setLoginError("Login successful but failed to save session. Please try again.");
            setIsLoading(false);
          }
        }, 200);
      }
      
    } catch (error) {
      setIsLoading(false);
      setLoginError(
        error.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    }
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return null;
    if (errors[field]) return 'error';
    if (formData[field]) return 'success';
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to track your carbon footprint
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Login Error Message */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">Login Failed</p>
                <p className="text-sm text-red-600 mt-1">{loginError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    getFieldStatus('email') === 'error' 
                      ? 'border-red-300 bg-red-50' 
                      : getFieldStatus('email') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only Gmail, Yahoo, and Outlook email addresses are allowed
              </p>
              {errors.email && touched.email && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  className={`w-full pl-11 pr-20 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    getFieldStatus('password') === 'error' 
                      ? 'border-red-300 bg-red-50' 
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {getFieldStatus('password') === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              {errors.password && touched.password && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Password Requirements Hint */}
            {touched.password && formData.password && (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-600' : ''}`}>
                    {formData.password.length >= 6 ? '✓' : '○'} At least 6 characters
                  </li>
                  <li className={`flex items-center gap-1 ${formData.password.length <= 20 ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.password.length <= 20 ? '✓' : '○'} Maximum 20 characters
                    {formData.password.length > 20 && ` (${formData.password.length}/20)`}
                  </li>
                  <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} One number
                  </li>
                </ul>
                <p className="text-gray-400 mt-1 text-right">{formData.password.length}/20 characters</p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className={`w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg ${
                (isLoading || Object.keys(errors).length > 0) ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}