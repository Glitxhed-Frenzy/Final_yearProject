// src/frontend/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import ActivityCard from "../components/ActivityCard";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { Calendar, Leaf, Activity, AlertCircle } from "lucide-react";
import { activityAPI } from '../../services/api'; // ADD THIS IMPORT

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  
  const [stats, setStats] = useState({
    total: null,
    electricity: null,
    transport: null,
    food: null,
    purchases: null,
    water: null,
    electronics: null
  });
  
  const [activities, setActivities] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadDashboardData();
    }
  }, [selectedPeriod]);

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUserName(JSON.parse(userData).name?.split(" ")[0] || "User");
      } catch {
        setUserName("User");
      }
    } else {
      navigate("/login");
    }
  };

  // UPDATED: Load data from backend
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch activities and stats in parallel
      const [activitiesRes, statsRes] = await Promise.all([
        activityAPI.getAll(),
        activityAPI.getStats()
      ]);
      
      const activitiesData = activitiesRes.data.data || [];
      const statsData = statsRes.data.data || {};
      
      setActivities(activitiesData);
      
      // Process stats for display
      const categoryTotals = statsData.categoryTotals || {};
      
      const newStats = {
        total: statsData.totalEmissions || null,
        electricity: categoryTotals.electricity || categoryTotals.home || null,
        transport: categoryTotals.transport || null,
        food: categoryTotals.food || null,
        purchases: categoryTotals.purchases || null,
        water: categoryTotals.water || null,
        electronics: categoryTotals.electronics || null
      };
      
      setStats(newStats);
      
      // Prepare chart data
      const chartData = [];
      if (newStats.electricity) chartData.push({ name: "Electricity", value: newStats.electricity });
      if (newStats.transport) chartData.push({ name: "Transport", value: newStats.transport });
      if (newStats.food) chartData.push({ name: "Food", value: newStats.food });
      if (newStats.purchases) chartData.push({ name: "Purchases", value: newStats.purchases });
      if (newStats.water) chartData.push({ name: "Water", value: newStats.water });
      if (newStats.electronics) chartData.push({ name: "Electronics", value: newStats.electronics });
      
      setCategoryBreakdown(chartData);
      setHasData(activitiesData.length > 0);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getActivityTitle = (activity) => {
    if (activity.categories && activity.categories.length === 1) {
      return `${activity.categories[0].charAt(0).toUpperCase() + activity.categories[0].slice(1)} Activity`;
    } else if (activity.categories && activity.categories.length > 1) {
      return `Multi-category Activity`;
    }
    return "Carbon Activity";
  };

  const getMainCategory = (activity) => {
    return activity.categories?.[0] || "general";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: "🚗",
      home: "⚡",
      electricity: "⚡",
      food: "🍎",
      purchases: "🛒",
      water: "💧",
      electronics: "💻",
      general: "📊"
    };
    return icons[category] || icons.general;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 h-32 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName || "User"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Track and reduce your carbon footprint
        </p>
      </div>

      {/* Time filter */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
          {['Today', 'Week', 'Month', 'Year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === selectedPeriod
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard 
          title="Total CO₂ Emissions" 
          value={stats.total ? `${stats.total.toFixed(1)} kg` : "—"}
          subtitle={stats.total ? `This ${selectedPeriod.toLowerCase()}` : "No data yet"}
          highlight={!stats.total}
          icon="🌍"
        />
        <MetricCard 
          title="Electricity" 
          value={stats.electricity ? `${stats.electricity.toFixed(1)} kg` : "—"}
          subtitle={stats.electricity ? `${Math.round(stats.electricity/0.82)} kWh` : "No data yet"}
          icon="⚡"
          color="blue"
        />
        <MetricCard 
          title="Transport" 
          value={stats.transport ? `${stats.transport.toFixed(1)} kg` : "—"}
          subtitle={stats.transport ? `${Math.round(stats.transport/0.20)} km` : "No data yet"}
          icon="🚗"
          color="purple"
        />
        <MetricCard 
          title="Food & Purchases" 
          value={stats.food || stats.purchases ? `${((stats.food || 0) + (stats.purchases || 0)).toFixed(1)} kg` : "—"}
          subtitle={stats.food || stats.purchases ? "Includes food & purchases" : "No data yet"}
          icon="🍎"
          color="orange"
        />
      </div>

      {/* Charts and Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Emissions Breakdown</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{selectedPeriod} • {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            
            {!hasData ? (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <Leaf className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No emissions data for {selectedPeriod}</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Start by adding your first activity using the "+ Add Activity" button in the navbar
                </p>
                <button
                  onClick={() => navigate('/add')}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium"
                >
                  Add Your First Activity
                </button>
              </div>
            ) : (
              <>
                <div className="h-80">
                  <DonutPlaceholder
                    centerLabel={`${stats.total?.toFixed(1) || 0} kg`}
                    data={categoryBreakdown.length ? categoryBreakdown : [{ name: "No Data", value: 1 }]}
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryBreakdown.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {item.value.toFixed(1)} kg
                      </div>
                      <div className="text-sm text-gray-600">{item.name}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 mb-2">No activities yet</p>
              <p className="text-sm text-gray-500">Click the + Add Activity button to start tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <ActivityCard 
                  key={activity._id}
                  title={getActivityTitle(activity)}
                  category={getMainCategory(activity)}
                  date={formatDate(activity.date)}
                  emission={activity.totalEmissions?.toFixed(1) || 0}
                  icon={getCategoryIcon(getMainCategory(activity))}
                />
              ))}
              {activities.length > 5 && (
                <button
                  onClick={() => navigate('/reports')}
                  className="w-full mt-4 px-4 py-2 text-green-600 hover:text-green-700 font-medium border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
                >
                  View All Activities
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}