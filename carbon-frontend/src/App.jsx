import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./frontend/components/Navbar";

import Dashboard from "./frontend/pages/Dashboard";
import AddActivity from "./frontend/pages/AddActivity";
import Reports from "./frontend/pages/Reports";
import Login from "./frontend/pages/Login";
import NotFound from "./frontend/pages/NotFound";

import AdminLayout from "./frontend/admin/AdminLayout";
import AdminLogin from "./frontend/admin/AdminLogin";
import AdminDashboard from "./frontend/admin/AdminDashboard";
import EmissionFactors from "./frontend/admin/EmissionFactors";
import Users from "./frontend/admin/Users";
import AdminStats from "./frontend/admin/AdminStats";

export default function App() {
  const location = useLocation();
  
  // Define routes where Navbar should NOT appear
  const hideNavbarRoutes = [
    '/login',
    '/admin/login',
    '/register', // If you add this later
    '/forgot-password' // If you add this later
  ];
  
  // Check if current route should hide Navbar
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900">
      {/* Conditionally render Navbar */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddActivity />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="emission-factors" element={<EmissionFactors />} />
          <Route path="users" element={<Users />} />
          <Route path="stats" element={<AdminStats />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}