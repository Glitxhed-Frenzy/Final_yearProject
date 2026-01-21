import { Routes, Route, Navigate } from "react-router-dom";
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddActivity />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
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