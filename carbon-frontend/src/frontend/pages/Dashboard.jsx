// src/frontend/pages/Dashboard.jsx
import MetricCard from "../components/MetricCard";
import ActivityCard from "../components/ActivityCard";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { Calendar, Leaf, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  
  const [stats, setStats] = useState({
    total: null,
    electricity: null,
    transport: null,
    food: null,
    purchases: null
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
    }
  };

  const loadDashboardData = () => {
    const savedActivities = localStorage.getItem('carbon_activities');
    
    if (!savedActivities) {
      setHasData(false);
      setStats({
        total: null,
        electricity: null,
        transport: null,
        food: null,
        purchases: null
      });
      setActivities([]);
      setCategoryBreakdown([]);
      setLoading(false);
      return;
    }

    try {
      const allActivities = JSON.parse(savedActivities);
      
      if (!allActivities || allActivities.length === 0) {
        setHasData(false);
        setActivities([]);
        setLoading(false);
        return;
      }

      const filteredActivities = filterActivitiesByPeriod(allActivities, selectedPeriod);
      
      if (filteredActivities.length === 0) {
        setHasData(true);
        setStats({
          total: null,
          electricity: null,
          transport: null,
          food: null,
          purchases: null
        });
        setActivities(getRecentActivities(allActivities, 5));
        setCategoryBreakdown([]);
        setLoading(false);
        return;
      }

      const calculatedStats = calculateStats(filteredActivities);
      setStats(calculatedStats);
      
      const chartData = [];
      if (calculatedStats.electricity) chartData.push({ name: "Electricity", value: calculatedStats.electricity });
      if (calculatedStats.transport) chartData.push({ name: "Transport", value: calculatedStats.transport });
      if (calculatedStats.food) chartData.push({ name: "Food", value: calculatedStats.food });
      if (calculatedStats.purchases) chartData.push({ name: "Purchases", value: calculatedStats.purchases });
      
      setCategoryBreakdown(chartData);
      setActivities(getRecentActivities(allActivities, 5));
      setHasData(true);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivitiesByPeriod = (activities, period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      
      switch(period) {
        case "Today":
          return activityDate.toDateString() === today.toDateString();
        case "Week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return activityDate >= weekAgo;
        case "Month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return activityDate >= monthAgo;
        case "Year":
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return activityDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  const calculateStats = (activities) => {
    const totals = {
      total: 0,
      electricity: 0,
      transport: 0,
      food: 0,
      purchases: 0
    };

    activities.forEach(activity => {
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (category === 'home') {
            totals.electricity += value;
          } else if (totals.hasOwnProperty(category)) {
            totals[category] += value;
          }
        });
      }
      
      if (activity.totalEmissions) {
        totals.total += parseFloat(activity.totalEmissions);
      }
    });

    if (totals.total === 0) {
      totals.total = totals.electricity + totals.transport + totals.food + totals.purchases;
    }

    Object.keys(totals).forEach(key => {
      totals[key] = totals[key] > 0 ? Math.round(totals[key] * 100) / 100 : null;
    });

    return totals;
  };

  const getRecentActivities = (activities, limit) => {
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map(activity => ({
        id: activity.id,
        title: getActivityTitle(activity),
        category: getMainCategory(activity),
        date: formatDate(activity.date),
        emission: activity.totalEmissions || 0,
        icon: getCategoryIcon(getMainCategory(activity))
      }));
  };

  const getActivityTitle = (activity) => {
    if (activity.category) {
      return `${activity.category.charAt(0).toUpperCase() + activity.category.slice(1)} Activity`;
    }
    const categories = activity.categoryTotals ? Object.keys(activity.categoryTotals) : [];
    if (categories.length === 1) {
      return `${categories[0].charAt(0).toUpperCase() + categories[0].slice(1)} Activity`;
    } else if (categories.length > 1) {
      return `Multi-category Activity`;
    }
    return "Carbon Activity";
  };

  const getMainCategory = (activity) => {
    if (activity.category) return activity.category;
    const categories = activity.categoryTotals ? Object.keys(activity.categoryTotals) : [];
    return categories.length > 0 ? categories[0] : "general";
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName}! 👋
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
          value={stats.total ? `${stats.total.toLocaleString()} kg` : "—"}
          subtitle={stats.total ? `This ${selectedPeriod.toLowerCase()}` : "No data yet"}
          highlight={!stats.total}
          icon="🌍"
        />
        <MetricCard 
          title="Electricity" 
          value={stats.electricity ? `${stats.electricity} kg` : "—"}
          subtitle={stats.electricity ? `${Math.round(stats.electricity/0.82)} kWh` : "No data yet"}
          icon="⚡"
          color="blue"
        />
        <MetricCard 
          title="Transport" 
          value={stats.transport ? `${stats.transport} kg` : "—"}
          subtitle={stats.transport ? `${Math.round(stats.transport/0.20)} km` : "No data yet"}
          icon="🚗"
          color="purple"
        />
        <MetricCard 
          title="Food & Purchases" 
          value={stats.food || stats.purchases ? `${(stats.food || 0) + (stats.purchases || 0)} kg` : "—"}
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
            
            {!stats.total ? (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <Leaf className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No emissions data for {selectedPeriod}</h3>
                <p className="text-gray-500 mb-6">
                  {hasData 
                    ? `You have data from other periods, but none for ${selectedPeriod.toLowerCase()}`
                    : "Start by adding your first activity using the + Add Activity button"}
                </p>
              </div>
            ) : (
              <>
                <div className="h-80">
                  <DonutPlaceholder
                    centerLabel={`${stats.total} kg`}
                    data={categoryBreakdown}
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryBreakdown.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(item.value)} kg
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
              {activities.map((activity) => (
                <ActivityCard 
                  key={activity.id}
                  title={activity.title}
                  category={activity.category}
                  date={activity.date}
                  emission={activity.emission}
                  icon={activity.icon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}