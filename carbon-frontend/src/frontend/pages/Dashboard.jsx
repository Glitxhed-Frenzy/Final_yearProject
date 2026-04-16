// src/frontend/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import ActivityCard from "../components/ActivityCard";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { Calendar, Activity, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { activityAPI } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [stats, setStats] = useState({
    total: null,
    transport: null,
    electricity: null,
    waste: null,
    food: null
  });
  
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      filterActivitiesByDate();
    }
  }, [selectedDate, activities]);

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

  const filterActivitiesByDate = () => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);
    
    const filtered = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= start && activityDate <= end;
    });
    
    setFilteredActivities(filtered);
    calculateFilteredStats(filtered);
  };

  const calculateFilteredStats = (filteredActivities) => {
    if (filteredActivities.length === 0) {
      setStats({
        total: null,
        transport: null,
        electricity: null,
        waste: null,
        food: null
      });
      setCategoryBreakdown([]);
      setHasData(false);
      return;
    }

    let totalEmissions = 0;
    const categoryTotals = {
      transport: 0,
      electricity: 0,
      waste: 0,
      food: 0
    };

    filteredActivities.forEach(activity => {
      totalEmissions += activity.totalEmissions || 0;
      
      if (activity.categoryTotals) {
        categoryTotals.transport += activity.categoryTotals.transport || 0;
        categoryTotals.electricity += activity.categoryTotals.electricity || 0;
        categoryTotals.waste += activity.categoryTotals.waste || 0;
        categoryTotals.food += activity.categoryTotals.food || 0;
      }
    });

    const newStats = {
      total: totalEmissions,
      transport: categoryTotals.transport,
      electricity: categoryTotals.electricity,
      waste: categoryTotals.waste,
      food: categoryTotals.food
    };

    setStats(newStats);
    
    const chartData = [];
    if (newStats.transport > 0) chartData.push({ name: "Transport", value: newStats.transport });
    if (newStats.electricity > 0) chartData.push({ name: "Electricity", value: newStats.electricity });
    if (newStats.waste > 0) chartData.push({ name: "Waste", value: newStats.waste });
    if (newStats.food > 0) chartData.push({ name: "Food", value: newStats.food });
    
    setCategoryBreakdown(chartData);
    setHasData(filteredActivities.length > 0);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await activityAPI.getAll();
      const activitiesData = response.data.data || [];
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowCalendar(false);
  };

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const getActivityTitle = (activity) => {
    if (activity.categories && activity.categories.length > 0) {
      const category = activity.categories[0];
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Activity`;
    }
    return "Carbon Activity";
  };

  const getMainCategory = (activity) => {
    return activity.categories?.[0] || "general";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: "🚗",
      electricity: "⚡",
      waste: "🗑️",
      food: "🍎",
      general: "📊"
    };
    return icons[category] || icons.general;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const selected = new Date(selectedDate);
    
    if (date.toDateString() === selected.toDateString()) {
      return formatTime(date);
    }
    
    return date.toLocaleDateString();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            {[1,2,3,4,5].map(i => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userName || "User"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Track and reduce your carbon footprint
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:border-green-500 hover:shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">{formatSelectedDate()}</span>
              </button>

              {showCalendar && (
                <>
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCalendar(false)}
                  />
                </>
              )}
            </div>

            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Next day"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatSelectedDate()}</span>
            {filteredActivities.length > 0 && (
              <span className="ml-1 text-green-600 font-medium">
                ({filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <MetricCard 
          title="Total CO₂" 
          value={stats.total ? `${stats.total.toFixed(1)} kg` : "—"}
          subtitle={stats.total ? `For ${formatSelectedDate().toLowerCase()}` : "No data"}
          highlight={!stats.total}
          icon="🌍"
          color="green"
        />
        <MetricCard 
          title="Transport" 
          value={stats.transport ? `${stats.transport.toFixed(1)} kg` : "—"}
          icon="🚗"
          color="purple"
        />
        <MetricCard 
          title="Electricity" 
          value={stats.electricity ? `${stats.electricity.toFixed(1)} kg` : "—"}
          icon="⚡"
          color="blue"
        />
        <MetricCard 
          title="Waste" 
          value={stats.waste ? `${stats.waste.toFixed(1)} kg` : "—"}
          icon="🗑️"
          color="emerald"
        />
        <MetricCard 
          title="Food" 
          value={stats.food ? `${stats.food.toFixed(1)} kg` : "—"}
          icon="🍎"
          color="amber"
        />
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Emissions Breakdown</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatSelectedDate()}</span>
                </div>
              </div>
              
              {!hasData ? (
                <div className="h-80 flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No data for {formatSelectedDate().toLowerCase()}</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    You haven't added any activities for this date.
                  </p>
                  <button
                    onClick={() => navigate('/add')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium"
                  >
                    Add Activity
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
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Activities for {formatSelectedDate()}
              </h2>
              
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-2">No activities for this day</p>
                  <p className="text-sm text-gray-500">Click the + Add Activity button to start tracking</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {filteredActivities.map((activity) => (
                    <ActivityCard 
                      key={activity._id}
                      title={getActivityTitle(activity)}
                      category={getMainCategory(activity)}
                      date={formatDate(activity.date)}
                      emission={activity.totalEmissions?.toFixed(1) || 0}
                      icon={getCategoryIcon(getMainCategory(activity))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}