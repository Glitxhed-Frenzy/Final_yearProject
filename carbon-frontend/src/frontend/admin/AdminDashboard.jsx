// src/frontend/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Leaf,
  Zap,
  Car,
  Utensils,
  Trash2,
  AlertCircle,
  Calendar
} from "lucide-react";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalEmissions: 0,
    averagePerActivity: 0,
    categoryTotals: {
      transport: 0,
      electricity: 0,
      waste: 0,
      food: 0
    },
    recentActivities: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getStats();
      console.log('Dashboard stats:', response.data);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: <Car className="w-4 h-4" />,
      electricity: <Zap className="w-4 h-4" />,
      waste: <Trash2 className="w-4 h-4" />,
      food: <Utensils className="w-4 h-4" />
    };
    return icons[category] || <Activity className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      transport: 'bg-purple-100 text-purple-700',
      electricity: 'bg-blue-100 text-blue-700',
      waste: 'bg-emerald-100 text-emerald-700',
      food: 'bg-amber-100 text-amber-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      transport: "Transport",
      electricity: "Electricity",
      waste: "Waste",
      food: "Food"
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 h-32 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
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
          onClick={loadDashboardData}
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasData = stats.totalActivities > 0;

  // Prepare chart data
  const chartData = [];
  if (stats.categoryTotals) {
    Object.entries(stats.categoryTotals).forEach(([category, value]) => {
      if (value > 0) {
        chartData.push({ 
          name: getCategoryDisplayName(category), 
          value: value 
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            {hasData 
              ? `Here's what's happening with your ${stats.totalUsers} users.`
              : "No data yet. Users haven't added any activities."}
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalActivities}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmissions} kg</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Avg per Activity</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.averagePerActivity} kg</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emissions by Category - Pie Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Emissions by Category</h2>
          <div className="h-80">
            <DonutPlaceholder
              centerLabel={`${stats.totalEmissions} kg`}
              data={chartData.length ? chartData : [{ name: "No Data", value: 1 }]}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm overflow-y-auto max-h-[500px]">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(stats.categoryTotals || {}).map(([category, value]) => {
              if (value > 0) {
                const percentage = stats.totalEmissions > 0 
                  ? Math.round((value / stats.totalEmissions) * 100) 
                  : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${getCategoryColor(category)}`}>
                          {getCategoryIcon(category)}
                        </span>
                        <span className="font-medium text-gray-900 capitalize">
                          {getCategoryDisplayName(category)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{value.toFixed(1)} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">{percentage}% of total</p>
                  </div>
                );
              }
              return null;
            })}
            {Object.values(stats.categoryTotals || {}).every(v => v === 0) && (
              <p className="text-gray-500 text-center py-4">No category data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentActivities && stats.recentActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivities.slice(0, 10).map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {activity.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.user?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-600">
                      Added {activity.totalEmissions} kg CO₂
                    </p>
                    <div className="flex gap-1 mt-1">
                      {activity.categories?.slice(0, 2).map(cat => (
                        <span key={cat} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                          {getCategoryDisplayName(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}