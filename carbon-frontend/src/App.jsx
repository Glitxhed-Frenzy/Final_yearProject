// src/frontend/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
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
  
  // Hide navbar on:
  // - Login/signup pages
  // - All admin routes (any path starting with /admin)
  const hideNavbarRoutes = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password'
  ];
  
  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Show navbar only if not on hideNavbarRoutes AND not an admin route
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname) && !isAdminRoute;

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900">
      {/* Conditionally render Navbar - hidden on admin routes */}
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

        {/* Admin - Navbar is hidden for all admin routes */}
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