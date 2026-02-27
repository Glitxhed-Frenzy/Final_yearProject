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
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalActivities: 0,
    totalEmissions: 0,
    avgEmission: 0,
    categoryTotals: {
      electricity: 0,
      transport: 0,
      food: 0,
      purchases: 0,
      water: 0,
      electronics: 0
    }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Get all users
    const allUsers = [];
    // Check if there's a logged-in user (in real app, you'd have a users collection)
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      allUsers.push(JSON.parse(currentUser));
    }
    
    // Get all activities
    const activities = JSON.parse(localStorage.getItem('carbon_activities') || '[]');
    
    // Calculate stats
    const totalActivities = activities.length;
    const totalEmissions = activities.reduce((sum, act) => sum + (act.totalEmissions || 0), 0);
    
    // Calculate category totals
    const categoryTotals = {
      electricity: 0,
      transport: 0,
      food: 0,
      purchases: 0,
      water: 0,
      electronics: 0
    };

    activities.forEach(activity => {
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (category === 'home') {
            categoryTotals.electricity += value;
          } else if (categoryTotals.hasOwnProperty(category)) {
            categoryTotals[category] += value;
          }
        });
      } else if (activity.answers) {
        Object.values(activity.answers).forEach(answer => {
          const cat = answer.category;
          if (cat === 'home') {
            categoryTotals.electricity += answer.emission || 0;
          } else if (categoryTotals.hasOwnProperty(cat)) {
            categoryTotals[cat] += answer.emission || 0;
          }
        });
      }
    });

    // Get recent activities
    const recent = activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(activity => ({
        id: activity.id,
        user: currentUser ? JSON.parse(currentUser).name : "Unknown User",
        action: getActivityDescription(activity),
        emission: activity.totalEmissions || 0,
        time: formatTimeAgo(activity.date),
        category: getMainCategory(activity)
      }));

    setStats({
      totalUsers: allUsers.length,
      activeUsers: activities.length > 0 ? 1 : 0, // Simplified for demo
      totalActivities,
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      avgEmission: totalActivities > 0 ? Math.round((totalEmissions / totalActivities) * 100) / 100 : 0,
      categoryTotals
    });

    setRecentActivities(recent);
    setUsers(allUsers);
    setLoading(false);
  };

  const getActivityDescription = (activity) => {
    if (activity.category) {
      return `Added ${activity.category} activity`;
    }
    const categories = activity.categoryTotals ? Object.keys(activity.categoryTotals) : [];
    if (categories.length === 1) {
      return `Added ${categories[0]} activity`;
    } else if (categories.length > 1) {
      return `Added activity (${categories.length} categories)`;
    }
    return "Added new activity";
  };

  const getMainCategory = (activity) => {
    if (activity.category) return activity.category;
    const categories = activity.categoryTotals ? Object.keys(activity.categoryTotals) : [];
    return categories.length > 0 ? categories[0] : 'general';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electricity: <Zap className="w-4 h-4" />,
      transport: <Car className="w-4 h-4" />,
      food: <Utensils className="w-4 h-4" />,
      purchases: <ShoppingBag className="w-4 h-4" />
    };
    return icons[category] || <Activity className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      electricity: 'bg-blue-100 text-blue-700',
      transport: 'bg-purple-100 text-purple-700',
      food: 'bg-amber-100 text-amber-700',
      purchases: 'bg-rose-100 text-rose-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
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

  const hasData = stats.totalActivities > 0;

  // Prepare chart data
  const chartData = [];
  if (stats.categoryTotals.electricity > 0) {
    chartData.push({ name: "Electricity", value: stats.categoryTotals.electricity });
  }
  if (stats.categoryTotals.transport > 0) {
    chartData.push({ name: "Transport", value: stats.categoryTotals.transport });
  }
  if (stats.categoryTotals.food > 0) {
    chartData.push({ name: "Food", value: stats.categoryTotals.food });
  }
  if (stats.categoryTotals.purchases > 0) {
    chartData.push({ name: "Purchases", value: stats.categoryTotals.purchases });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            {hasData 
              ? "Here's what's happening with your platform."
              : "No data yet. Users haven't added any activities."}
          </p>
        </div>
      </div>

      {!hasData ? (
        /* Empty State - No Data */
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The dashboard will display analytics once users start adding activities and tracking their carbon footprint.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/admin/emission-factors'}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Add Emission Factors
            </button>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              View Users
            </button>
          </div>
        </div>
      ) : (
        /* Data View */
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Users</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalActivities}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Activities</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="p-3 bg-amber-100 rounded-xl w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalEmissions} kg</h3>
              <p className="text-gray-600 text-sm mt-1">Total CO₂ Emissions</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.avgEmission} kg</h3>
              <p className="text-gray-600 text-sm mt-1">Avg per Activity</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Emissions by Category */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Emissions by Category</h2>
              <div className="h-80">
                <DonutPlaceholder
                  centerLabel={`${stats.totalEmissions} kg`}
                  data={chartData.length ? chartData : [
                    { name: "No Data", value: 1 }
                  ]}
                />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(stats.categoryTotals).map(([category, value]) => {
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
                            <span className="font-medium text-gray-900 capitalize">{category}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{value} kg</span>
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
                {Object.values(stats.categoryTotals).every(v => v === 0) && (
                  <p className="text-gray-500 text-center py-4">No category data yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {activity.user?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{activity.emission} kg</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}