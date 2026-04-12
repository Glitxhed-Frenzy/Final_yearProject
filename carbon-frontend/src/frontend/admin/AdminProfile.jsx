// src/frontend/admin/AdminProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield
} from "lucide-react";
import { authAPI } from '../../services/api';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileForm({
        name: parsed.name || "",
        email: parsed.email || ""
      });
    } else {
      navigate("/admin/login");
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!profileForm.name.trim()) newErrors.name = "Name is required";
    if (!profileForm.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) newErrors.email = "Email is invalid";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await authAPI.updateDetails({
        name: profileForm.name,
        email: profileForm.email
      });
      
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setErrors({});
      showSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showSuccessMessage("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordForm.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await authAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
      showSuccessMessage("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      showSuccessMessage(error.response?.data?.message || "Failed to change password");
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-down">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        </div>
        <p className="text-gray-600">Manage your administrator account</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <p className="text-lg text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <p className="text-lg text-gray-900">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Administrator</span>
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />
                Member Since
              </label>
              <p className="text-lg text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Password</h2>
            <p className="text-gray-600 mt-1">Change your administrator password</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setErrors({});
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}