// src/frontend/pages/AddActivity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Car, Plane, Train, Bus, Zap, Droplets, Thermometer,
  Tv, Laptop, Shirt, Apple, 
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Save,
  Trash2, RefreshCw, ArrowLeft
} from "lucide-react";
import { activityAPI } from '../../services/api';
import CarbonTips from "../components/CarbonTips";  // 👈 ADD THIS IMPORT

// Simple categories
const categories = [
  { id: 'transport', label: 'Transportation', icon: <Car className="w-5 h-5" />, color: 'purple' },
  { id: 'home', label: 'Home Energy', icon: <Home className="w-5 h-5" />, color: 'blue' },
  { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-5 h-5" />, color: 'indigo' },
  { id: 'water', label: 'Water Usage', icon: <Droplets className="w-5 h-5" />, color: 'cyan' },
  { id: 'food', label: 'Food & Diet', icon: <Apple className="w-5 h-5" />, color: 'amber' }
];

// Simple questions - no complex dependencies
const questions = {
  transport: {
    title: "Transportation",
    icon: <Car className="w-6 h-6" />,
    color: "from-purple-500 to-violet-600",
    questions: [
      {
        id: "car_miles",
        text: "Car Miles",
        type: "number",
        unit: "miles",
        min: 0,
        max: 5000,
        step: 10,
        factor: 0.41,
        icon: <Car className="w-5 h-5" />,
        helpText: "How many miles did you drive this month?"
      },
      {
        id: "bus_miles",
        text: "Bus Miles",
        type: "number",
        unit: "miles",
        min: 0,
        max: 1000,
        step: 5,
        factor: 0.18,
        icon: <Bus className="w-5 h-5" />,
        helpText: "How many miles did you travel by bus?"
      },
      {
        id: "train_miles",
        text: "Train Miles",
        type: "number",
        unit: "miles",
        min: 0,
        max: 1000,
        step: 5,
        factor: 0.12,
        icon: <Train className="w-5 h-5" />,
        helpText: "How many miles did you travel by train?"
      },
      {
        id: "plane_miles",
        text: "Plane Miles",
        type: "number",
        unit: "miles",
        min: 0,
        max: 10000,
        step: 100,
        factor: 0.53,
        icon: <Plane className="w-5 h-5" />,
        helpText: "How many miles did you fly?"
      }
    ]
  },
  
  home: {
    title: "Home Energy",
    icon: <Home className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-600",
    questions: [
      {
        id: "electricity_kwh",
        text: "Electricity Usage",
        type: "number",
        unit: "kWh",
        min: 0,
        max: 2000,
        step: 10,
        factor: 0.85,
        icon: <Zap className="w-5 h-5" />,
        helpText: "Check your electricity bill for monthly kWh"
      },
      {
        id: "ac_days",
        text: "AC Usage",
        type: "number",
        unit: "days",
        min: 0,
        max: 31,
        step: 1,
        factor: 3.2,
        icon: <Thermometer className="w-5 h-5" />,
        helpText: "How many days did you use AC this month?"
      },
      {
        id: "heat_days",
        text: "Heating Usage",
        type: "number",
        unit: "days",
        min: 0,
        max: 31,
        step: 1,
        factor: 4.5,
        icon: <Thermometer className="w-5 h-5" />,
        helpText: "How many days did you use heating?"
      }
    ]
  },
  
  electronics: {
    title: "Electronics",
    icon: <Laptop className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
    questions: [
      {
        id: "laptop_hours",
        text: "Laptop Usage",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 0.02,
        icon: <Laptop className="w-5 h-5" />,
        helpText: "Hours per day your laptop is plugged in"
      },
      {
        id: "tv_hours",
        text: "TV Hours",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 0.04,
        icon: <Tv className="w-5 h-5" />,
        helpText: "Hours per day you watch TV"
      }
    ]
  },
  
  water: {
    title: "Water Usage",
    icon: <Droplets className="w-6 h-6" />,
    color: "from-cyan-500 to-teal-600",
    questions: [
      {
        id: "showers_per_week",
        text: "Showers",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 0.6,
        icon: <Droplets className="w-5 h-5" />,
        helpText: "How many showers do you take per week?"
      },
      {
        id: "laundry_per_month",
        text: "Laundry Loads",
        type: "number",
        unit: "per month",
        min: 0,
        max: 50,
        step: 1,
        factor: 0.8,
        icon: <Shirt className="w-5 h-5" />,
        helpText: "How many loads of laundry per month?"
      }
    ]
  },
  
  food: {
    title: "Food & Diet",
    icon: <Apple className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
    questions: [
      {
        id: "chicken_servings",
        text: "Chicken Servings",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 6.9,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How many chicken meals per week?"
      },
      {
        id: "vegetarian_meals",
        text: "Vegetarian Meals",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 2.0,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How many vegetarian meals per week?"
      }
    ]
  }
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState("transport");
  
  // Simple state for form values
  const [values, setValues] = useState({});
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 👈 ADD STATS STATE FOR TIPS
  const [stats, setStats] = useState({
    total: null,
    transport: null,
    home: null,
    electronics: null,
    water: null,
    food: null
  });
  
  // Load existing activities and stats
  useEffect(() => {
    fetchActivities();
    fetchStats();  // 👈 ADD THIS
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // 👈 ADD FETCH STATS FUNCTION
  const fetchStats = async () => {
    try {
      const response = await activityAPI.getStats();
      const statsData = response.data.data || {};
      const categoryTotals = statsData.categoryTotals || {};
      
      setStats({
        total: statsData.totalEmissions || null,
        transport: categoryTotals.transport || null,
        home: categoryTotals.home || null,
        electronics: categoryTotals.electronics || null,
        water: categoryTotals.water || null,
        food: categoryTotals.food || null
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Simple input handler
  const handleInputChange = (questionId, value) => {
    const numValue = parseFloat(value) || 0;
    setValues(prev => ({
      ...prev,
      [questionId]: numValue
    }));
  };

  // Calculate estimated emission for a single question
  const getEstimatedEmission = (questionId, value, factor) => {
    if (!value || value <= 0) return null;
    return (value * factor).toFixed(2);
  };

  const hasAnyData = () => {
    return Object.keys(values).some(key => values[key] > 0);
  };

  // Save activity
  const saveActivity = async () => {
    if (!hasAnyData()) {
      alert("Please add some data first");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data - only include non-zero values
      const dataToSend = {};
      Object.keys(values).forEach(key => {
        if (values[key] > 0) {
          dataToSend[key] = values[key];
        }
      });

      const response = await activityAPI.create(dataToSend);
      
      setActivities(prev => [response.data.data, ...prev]);
      
      // Refresh stats after saving
      fetchStats();  // 👈 ADD THIS TO REFRESH TIPS DATA
      
      // Calculate total for success message
      let total = 0;
      Object.keys(values).forEach(key => {
        const question = findQuestion(key);
        if (question && values[key] > 0) {
          total += values[key] * question.factor;
        }
      });
      
      setSuccessMessage(`Activity saved! Total: ${total.toFixed(2)} kg CO₂`);
      setShowSuccess(true);
      
      // Clear form
      setTimeout(() => {
        setValues({});
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving activity:", error);
      alert(error.response?.data?.message || "Failed to save activity");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to find question by ID
  const findQuestion = (questionId) => {
    for (const cat of Object.values(questions)) {
      const q = cat.questions.find(q => q.id === questionId);
      if (q) return q;
    }
    return null;
  };

  // Reset form
  const resetForm = () => {
    if (hasAnyData()) {
      if (window.confirm("Clear all data?")) {
        setValues({});
      }
    }
  };

  // Delete activity
  const deleteActivity = async (activityId) => {
    if (window.confirm("Delete this activity?")) {
      try {
        await activityAPI.delete(activityId);
        setActivities(prev => prev.filter(a => a._id !== activityId));
        fetchStats();  // 👈 ADD THIS TO REFRESH TIPS AFTER DELETE
        setShowDeleteOptions(false);
        setSuccessMessage("Activity deleted");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete");
      }
    }
  };

  const getCategoryColor = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-down">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Activity</h1>
            <p className="text-gray-600 mt-2">
              Enter your monthly usage below
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={saveActivity}
            disabled={!hasAnyData() || isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
              hasAnyData() && !isLoading
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Activity
              </>
            )}
          </button>

          {hasAnyData() && !isLoading && (
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}

          {activities.length > 0 && !isLoading && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              
              {showDeleteOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50">
                  <button
                    onClick={() => setShowDeleteOptions(false)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 border-b"
                  >
                    ← Cancel
                  </button>
                  
                  {activities.slice(0, 5).map(activity => (
                    <button
                      key={activity._id}
                      onClick={() => deleteActivity(activity._id)}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex justify-between"
                    >
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                      <span>{activity.totalEmissions} kg</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="bg-white rounded-xl shadow-sm p-2 inline-flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentCategory === cat.id
                    ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${questions[currentCategory].color} text-white`}>
                  {questions[currentCategory].icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{questions[currentCategory].title}</h2>
              </div>

              <div className="space-y-6">
                {questions[currentCategory].questions.map((q) => {
                  const currentValue = values[q.id];
                  const emission = getEstimatedEmission(q.id, currentValue, q.factor);
                  
                  return (
                    <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {q.icon}
                        </div>
                        <div className="flex-1">
                          <label className="block font-medium text-gray-900 mb-2">
                            {q.text}
                          </label>
                          
                          <div className="relative">
                            <input
                              type="number"
                              min={q.min}
                              max={q.max}
                              step={q.step}
                              value={currentValue || ''}
                              onChange={(e) => handleInputChange(q.id, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                              placeholder={`Enter ${q.unit}`}
                              disabled={isLoading}
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              {q.unit}
                            </span>
                          </div>

                          {q.helpText && (
                            <p className="text-xs text-gray-500 mt-2">💡 {q.helpText}</p>
                          )}

                          {emission && (
                            <p className="text-sm text-green-600 font-medium mt-2">
                              ≈ {emission} kg CO₂
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary & Tips Section */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Summary
              </h3>
              
              <div className="space-y-3 mb-6">
                {Object.keys(values).length > 0 ? (
                  Object.entries(values).map(([id, val]) => {
                    if (val <= 0) return null;
                    const q = findQuestion(id);
                    if (!q) return null;
                    
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{q.text}</span>
                        <span className="font-medium">{val} {q.unit}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No data yet
                  </p>
                )}
              </div>

              {hasAnyData() && (
                <button
                  onClick={saveActivity}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Activity'}
                </button>
              )}
            </div>

            {/* 👈 SMART TIPS SECTION - ADDED */}
            {stats && stats.total !== null && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <CarbonTips stats={stats} activities={activities} />
              </div>
            )}

            {/* Recent Activities */}
            {activities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent</h3>
                <div className="space-y-2">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{activity.totalEmissions} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}