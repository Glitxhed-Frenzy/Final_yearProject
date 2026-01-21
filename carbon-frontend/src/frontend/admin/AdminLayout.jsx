import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold text-green-600 mb-6">Admin</h2>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/emission-factors">Emission Factors</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/stats">Stats</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}
