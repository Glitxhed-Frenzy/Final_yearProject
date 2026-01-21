import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              CarbonTracker
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/add" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`
              }
            >
              Add Activity
            </NavLink>
            <NavLink 
              to="/reports" 
              className={({ isActive }) => 
                `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`
              }
            >
              Reports
            </NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-green-200">
              <span className="text-sm font-medium text-emerald-700">1240 kg CO₂</span>
            </div>
            <NavLink
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}