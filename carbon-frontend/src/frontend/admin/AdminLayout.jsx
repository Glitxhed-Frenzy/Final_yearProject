// src/frontend/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Factory, 
  Users, 
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronRight,
  User,
  Settings,
  Shield
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Get admin user info
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/admin/emission-factors", label: "Emission Factors", icon: <Factory className="w-5 h-5" /> },
    { to: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gradient-to-b from-green-800 to-green-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl
      `}>
        {/* Logo Area */}
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-xs text-green-300 mt-0.5">Carbon Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg shadow-black/10' 
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile Section - Improved */}
        <div className="p-4 border-t border-green-700 mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            {/* Admin Avatar and Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{adminUser.name || 'Admin User'}</p>
                <p className="text-green-300 text-xs truncate">{adminUser.email || 'admin@example.com'}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/20 my-3"></div>

            {/* Admin Actions */}
            <div className="space-y-2">
              <button 
                onClick={() => {
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-200 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Profile Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 rounded-lg transition-colors group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="min-h-screen p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}