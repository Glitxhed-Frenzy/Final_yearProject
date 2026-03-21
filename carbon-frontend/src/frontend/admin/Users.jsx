// src/frontend/admin/Users.jsx
import { useState, useEffect } from "react";
import { 
  Users as UsersIcon, 
  AlertCircle, 
  Trash2, 
  Eye,
  UserCheck,
  LogIn
} from "lucide-react";
import { adminAPI, authAPI } from '../../services/api';
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getUsers();
      console.log('Users response:', response.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // NEW: Impersonate user
  const handleImpersonate = async (user) => {
    try {
      // Store the admin's original token before impersonating
      const adminToken = localStorage.getItem('token');
      localStorage.setItem('adminOriginalToken', adminToken);
      localStorage.setItem('adminOriginalUser', localStorage.getItem('user'));
      
      // Create a mock login for the user (in production, this would be a backend API call)
      // For now, we'll simulate user login with their data
      const mockToken = `impersonated_${user._id}_${Date.now()}`;
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isImpersonated: true,
        impersonatedBy: JSON.parse(localStorage.getItem('user'))?.name || 'Admin'
      }));
      
      // Redirect to user dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error impersonating user:", error);
      alert("Failed to impersonate user");
    }
  };

  // Helper to get back to admin
  const exitImpersonation = () => {
    const originalToken = localStorage.getItem('adminOriginalToken');
    const originalUser = localStorage.getItem('adminOriginalUser');
    
    if (originalToken && originalUser) {
      localStorage.setItem('token', originalToken);
      localStorage.setItem('user', originalUser);
      localStorage.removeItem('adminOriginalToken');
      localStorage.removeItem('adminOriginalUser');
      window.location.href = '/admin/dashboard';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Users Yet</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Users will appear here once they sign up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">
          Managing {users.length} registered users
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Joined</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {/* Impersonate Button - Only show for non-admin users */}
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleImpersonate(user)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Sign in as this user"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Exit Impersonation Banner (shown when impersonating) */}
      {localStorage.getItem('adminOriginalToken') && (
        <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Impersonation Mode</p>
              <p className="text-xs text-amber-700">You're viewing as a user</p>
            </div>
            <button
              onClick={exitImpersonation}
              className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}