import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Welcome from "./frontend/pages/Welcome";

import Navbar from "./frontend/components/Navbar";

import Dashboard from "./frontend/pages/Dashboard";
import AddActivity from "./frontend/pages/AddActivity";
import Reports from "./frontend/pages/Reports";
import Login from "./frontend/pages/Login";
import NotFound from "./frontend/pages/NotFound";
import Profile from "./frontend/pages/Profile";
import SignUp from "./frontend/pages/SignUp";

import AdminLayout from "./frontend/admin/AdminLayout";
import AdminLogin from "./frontend/admin/AdminLogin";
import AdminDashboard from "./frontend/admin/AdminDashboard";
import EmissionFactors from "./frontend/admin/EmissionFactors";
import Users from "./frontend/admin/Users";

export default function App() {
  const location = useLocation();
  
  // Define routes where Navbar should NOT appear
  const hideNavbarRoutes = [
    '/login',
    '/admin/login',
    '/register',
    '/forgot-password',
    '/signup'
  ];
  
  // Check if current route should hide Navbar
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900">
      {/* Conditionally render Navbar */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddActivity />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="emission-factors" element={<EmissionFactors />} />
          <Route path="users" element={<Users />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}