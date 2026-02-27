// src/frontend/admin/Users.jsx
import { useState, useEffect } from "react";
import { Users as UsersIcon, Search, AlertCircle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasUsers = users.length > 0;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <p className="text-gray-600 mb-6">
        {hasUsers 
          ? "Manage and view all registered users"
          : "No users have registered yet"}
      </p>

      {!hasUsers ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Users Yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Users will appear here once they sign up and start using the application.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* User management table/content */}
        </div>
      )}
    </>
  );
}