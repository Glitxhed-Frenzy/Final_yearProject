// src/frontend/components/Navbar.jsx
import { NavLink, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useState, useEffect } from "react";
import { User, LogOut, ChevronDown, PlusCircle } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Don't render navbar on login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null; // Returns nothing - navbar won't show
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-green-600">Carbon Tracker</h1>

        {/* Navigation Links - Only show when user is logged in */}
        {user && (
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `hover:text-green-600 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-700'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                `hover:text-green-600 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-700'
                }`
              }
            >
              Reports
            </NavLink>
          </nav>
        )}

        {/* Right side: Add Activity + User info */}
        <div className="flex items-center gap-4">
          {/* Add Activity Button - Prominent in navbar */}
          {user && (
            <button
              onClick={() => navigate('/add')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Activity</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : null /* Removed the Sign In button completely */}
        </div>
      </div>

      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}