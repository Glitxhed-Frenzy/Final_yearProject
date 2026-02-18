import MetricCard from "../components/MetricCard";
import ActivityCard from "../components/ActivityCard";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { Plus, Calendar, Leaf, Activity, TrendingDown, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  
  // State for dynamic data - initially null/empty
  const [stats, setStats] = useState({
    total: null,
    electricity: null,
    transport: null,
    food: null,
    purchases: null,
    water: null,
    electronics: null
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [hasData, setHasData] = useState(false);

  // Load data whenever component mounts or period changes
  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadDashboardData();
    }
  }, [selectedPeriod]);

  // Listen for new activities (in case user adds from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'carbon_activities') {
        loadDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    // Get activities from localStorage
    const savedActivities = localStorage.getItem('carbon_activities');
    
    if (!savedActivities) {
      // No data at all
      setHasData(false);
      setStats({
        total: null,
        electricity: null,
        transport: null,
        food: null,
        purchases: null,
        water: null,
        electronics: null
      });
      setRecentActivities([]);
      setCategoryBreakdown([]);
      setLoading(false);
      return;
    }

    try {
      const allActivities = JSON.parse(savedActivities);
      
      if (!allActivities || allActivities.length === 0) {
        setHasData(false);
        setRecentActivities([]);
        setLoading(false);
        return;
      }

      // Filter activities based on selected period
      const filteredActivities = filterActivitiesByPeriod(allActivities, selectedPeriod);
      
      if (filteredActivities.length === 0) {
        // Has data but none in selected period
        setHasData(true);
        setStats({
          total: null,
          electricity: null,
          transport: null,
          food: null,
          purchases: null,
          water: null,
          electronics: null
        });
        setRecentActivities(getRecentActivities(allActivities, 5));
        setCategoryBreakdown([]);
        setLoading(false);
        return;
      }

      // Calculate stats from filtered activities
      const calculatedStats = calculateStats(filteredActivities);
      setStats(calculatedStats);
      
      // Prepare chart data (only categories with values)
      const chartData = [];
      if (calculatedStats.electricity) chartData.push({ name: "Electricity", value: calculatedStats.electricity });
      if (calculatedStats.transport) chartData.push({ name: "Transport", value: calculatedStats.transport });
      if (calculatedStats.food) chartData.push({ name: "Food", value: calculatedStats.food });
      if (calculatedStats.purchases) chartData.push({ name: "Purchases", value: calculatedStats.purchases });
      if (calculatedStats.water) chartData.push({ name: "Water", value: calculatedStats.water });
      if (calculatedStats.electronics) chartData.push({ name: "Electronics", value: calculatedStats.electronics });
      
      setCategoryBreakdown(chartData);
      setRecentActivities(getRecentActivities(allActivities, 5));
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
      purchases: 0,
      water: 0,
      electronics: 0
    };

    activities.forEach(activity => {
      // If activity has categoryTotals (from new format)
      if (activity.categoryTotals) {
        Object.entries(activity.categoryTotals).forEach(([category, value]) => {
          if (totals.hasOwnProperty(category)) {
            totals[category] += value;
          } else if (category === 'home') {
            totals.electricity += value;
          }
        });
      } 
      // If activity has answers (from individual questions)
      else if (activity.answers) {
        Object.values(activity.answers).forEach(answer => {
          const category = answer.category;
          if (category === 'home' || category === 'electricity') {
            totals.electricity += answer.emission || 0;
          } else if (totals.hasOwnProperty(category)) {
            totals[category] += answer.emission || 0;
          }
        });
      }
      
      // Add total emissions if available
      if (activity.totalEmissions) {
        totals.total += parseFloat(activity.totalEmissions);
      }
    });

    // Calculate total from categories if not already set
    if (totals.total === 0) {
      totals.total = totals.electricity + totals.transport + totals.food + 
                     totals.purchases + totals.water + totals.electronics;
    }

    // Round to 2 decimal places and convert null if zero
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
        emission: activity.totalEmissions || getTotalFromCategories(activity),
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
      return `Multi-category Activity (${categories.length} categories)`;
    }
    
    return "Carbon Activity";
  };

  const getMainCategory = (activity) => {
    if (activity.category) return activity.category;
    
    const categories = activity.categoryTotals ? Object.keys(activity.categoryTotals) : [];
    return categories.length > 0 ? categories[0] : "general";
  };

  const getTotalFromCategories = (activity) => {
    if (!activity.categoryTotals) return "0";
    return Object.values(activity.categoryTotals).reduce((sum, val) => sum + val, 0).toFixed(2);
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
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleAddActivity = () => {
    navigate('/add');
  };

  // Loading state
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          
          {/* Stats grid skeleton */}
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
      <div className="flex justify-between items-center mb-8">
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
        
        <button 
          onClick={handleAddActivity}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Stats Grid - Shows null values as "—" when no data */}
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
            
            {/* Show empty state if no data for selected period */}
            {!stats.total ? (
              <div className="h-80 flex flex-col items-center justify-center text-center">
                <Leaf className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No emissions data for {selectedPeriod}</h3>
                <p className="text-gray-500 mb-6">
                  {hasData 
                    ? `You have data from other periods, but none for ${selectedPeriod.toLowerCase()}`
                    : "Start by adding your first activity"
                  }
                </p>
                <button 
                  onClick={handleAddActivity}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700"
                >
                  {hasData ? "Add More Activities" : "Add Your First Activity"}
                </button>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            {recentActivities.length > 0 && (
              <span className="text-sm text-green-600 font-medium cursor-pointer hover:text-green-700">
                View All →
              </span>
            )}
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 mb-2">No activities yet</p>
              <p className="text-sm text-gray-500">Add your first activity to start tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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

          {/* Insights Card - Only show if data exists */}
          {stats.total && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🌱 Insight</h3>
              <p className="text-sm text-blue-800">
                {stats.total < 500 
                  ? `Great job! Your carbon footprint is ${stats.total} kg this ${selectedPeriod.toLowerCase()}. Keep it up!` 
                  : `You've emitted ${stats.total} kg CO₂ this ${selectedPeriod.toLowerCase()}. Try to reduce by using public transport or saving energy.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}