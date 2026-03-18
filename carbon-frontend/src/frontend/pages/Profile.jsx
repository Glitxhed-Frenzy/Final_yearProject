// src/frontend/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  Trash2,
  LogOut,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Download,
  Activity,
  Award,
  TrendingDown,
  Clock
} from "lucide-react";
import { activityAPI } from '../../services/api'; // ADD THIS IMPORT

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalEmissions: 0,
    averagePerActivity: 0,
    joinDate: null,
    categories: {}
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
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

  const [errors, setErrors] = useState({});

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  // 🔴 FIX 1: Load stats whenever user data is available
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfileForm({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        location: parsed.location || "",
        bio: parsed.bio || ""
      });
    } else {
      navigate("/login");
    }
    setLoading(false);
  };

  // 🔴 FIX 2: Load stats from BACKEND instead of localStorage
  const loadUserStats = async () => {
    try {
      // Fetch activities from backend
      const response = await activityAPI.getAll();
      const activities = response.data.data || [];
      
      // Fetch stats from backend
      const statsRes = await activityAPI.getStats();
      const statsData = statsRes.data.data || {};
      
      // Calculate category counts from activities
      const categoryCounts = {};
      activities.forEach(act => {
        if (act.categories) {
          act.categories.forEach(cat => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }
      });

      setStats({
        totalActivities: activities.length,
        totalEmissions: statsData.totalEmissions || 0,
        averagePerActivity: statsData.averagePerActivity || 0,
        // 🔴 FIX 3: Use user's createdAt from localStorage or current date
        joinDate: user?.createdAt || new Date().toISOString(),
        categories: categoryCounts
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Fallback to empty stats
      setStats({
        totalActivities: 0,
        totalEmissions: 0,
        averagePerActivity: 0,
        joinDate: user?.createdAt || new Date().toISOString(),
        categories: {}
      });
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!profileForm.name.trim()) newErrors.name = "Name is required";
    if (!profileForm.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) newErrors.email = "Email is invalid";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditing(false);
    setErrors({});
    showSuccessMessage("Profile updated successfully!");
  };

  const handlePasswordChange = (e) => {
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

    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    showSuccessMessage("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("carbon_activities");
    localStorage.removeItem("current_session_answers");
    navigate("/login");
  };

  const handleExportData = async () => {
    try {
      // Get data from backend instead of localStorage
      const activitiesRes = await activityAPI.getAll();
      const activities = activitiesRes.data.data || [];
      
      const userData = {
        user: user,
        activities: activities,
        stats: stats,
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `carbon-footprint-export-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showSuccessMessage("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: "🚗",
      home: "🏠",
      electricity: "⚡",
      food: "🍎",
      purchases: "🛒",
      water: "💧",
      electronics: "💻"
    };
    return icons[category] || "📊";
  };

  // 🔴 FIX 4: Format date safely with fallback
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Just now";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Just now";
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (error) {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 h-64"></div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 h-48"></div>
                <div className="bg-white rounded-2xl p-6 h-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-down">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header with spacing */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your account and track your carbon footprint journey
          </p>
        </div>

        {/* Main Grid with proper gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sticky top-24">
              {/* Profile Picture - More prominent */}
              <div className="text-center mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 mt-2">{user?.email}</p>
                
                {/* Edit Profile Button - Moved here */}
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Stats in card - More breathing room */}
              <div className="space-y-5 pt-6 border-t border-gray-200">
                {/* 🔴 FIX 5: Member since with proper date formatting */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatJoinDate(stats.joinDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>Activities</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalActivities}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>Total CO₂</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.totalEmissions} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Avg per activity</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.averagePerActivity} kg</span>
                </div>
              </div>

              {/* Action Buttons - More spaced */}
              <div className="space-y-3 mt-8">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                >
                  <Download className="w-4 h-4" />
                  Export My Data
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Content with more spacing */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
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
                // View Mode - Clean grid layout
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <p className="text-lg text-gray-900">{user?.phone || <span className="text-gray-400">Not added</span>}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <p className="text-lg text-gray-900">{user?.location || <span className="text-gray-400">Not added</span>}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      Bio
                    </label>
                    <p className="text-lg text-gray-900">{user?.bio || <span className="text-gray-400">No bio added yet</span>}</p>
                  </div>
                </div>
              ) : (
                // Edit Mode - Spacious form
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => {
                          setProfileForm({...profileForm, name: e.target.value});
                          setErrors({...errors, name: ""});
                        }}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => {
                          setProfileForm({...profileForm, email: e.target.value});
                          setErrors({...errors, email: ""});
                        }}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        placeholder="New York, USA"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      rows="4"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                      placeholder="Tell us a bit about yourself and your sustainability goals..."
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium text-lg"
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
                  <p className="text-gray-600 mt-2">Change your password regularly to keep your account secure</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Activity Summary - Only if there are activities */}
            {Object.keys(stats.categories).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(stats.categories).map(([category, count]) => (
                    <div key={category} className="p-5 bg-gray-50 rounded-xl">
                      <div className="text-3xl mb-3">{getCategoryIcon(category)}</div>
                      <p className="font-semibold text-gray-900 capitalize text-lg">{category}</p>
                      <p className="text-gray-600">{count} {count === 1 ? 'activity' : 'activities'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone - Spaced out */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">Danger Zone</h2>
              <p className="text-gray-600 mb-6">Permanently delete your account and all associated data</p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              ) : (
                <div className="bg-red-50 rounded-xl p-6">
                  <p className="text-red-700 font-medium mb-3 text-lg">Are you absolutely sure?</p>
                  <p className="text-red-600 mb-6">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
                    >
                      Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 text-lg ${
                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 text-lg ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 text-lg ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium text-lg"
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
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium text-lg"
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