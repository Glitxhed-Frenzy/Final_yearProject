// src/frontend/pages/AddActivity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Car, Plane, Train, Bus, Zap, Droplets, Thermometer,
  Tv, Laptop, Smartphone, Shirt, Apple, Coffee,
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Save,
  Trash2, RefreshCw, ArrowLeft
} from "lucide-react";
import { activityAPI } from '../../services/api';

const categories = [
  { id: 'transport', label: 'Transportation', icon: <Car className="w-5 h-5" />, color: 'purple' },
  { id: 'home', label: 'Home Energy', icon: <Home className="w-5 h-5" />, color: 'blue' },
  { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-5 h-5" />, color: 'indigo' },
  { id: 'water', label: 'Water Usage', icon: <Droplets className="w-5 h-5" />, color: 'cyan' },
  { id: 'food', label: 'Food & Diet', icon: <Apple className="w-5 h-5" />, color: 'amber' }
];

// Questions now only have UI info - factors are kept for display only
// The actual calculations will happen on backend
const questions = {
  transport: {
    title: "Transportation",
    icon: <Car className="w-6 h-6" />,
    color: "from-purple-500 to-violet-600",
    questions: [
      {
        id: "car_miles",
        text: "Car Miles Per Month",
        type: "number",
        unit: "miles",
        min: 0,
        max: 5000,
        step: 10,
        factor: 0.20, // For display only
        icon: <Car className="w-5 h-5" />
      },
      {
        id: "bus_miles",
        text: "Bus Miles Per Month",
        type: "number",
        unit: "miles",
        min: 0,
        max: 1000,
        step: 5,
        factor: 0.08, // For display only
        icon: <Bus className="w-5 h-5" />
      },
      {
        id: "train_miles",
        text: "Train Miles Per Month",
        type: "number",
        unit: "miles",
        min: 0,
        max: 1000,
        step: 5,
        factor: 0.05, // For display only
        icon: <Train className="w-5 h-5" />
      },
      {
        id: "plane_miles",
        text: "Plane Miles Per Month",
        type: "number",
        unit: "miles",
        min: 0,
        max: 10000,
        step: 100,
        factor: 0.25, // For display only
        icon: <Plane className="w-5 h-5" />
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
        unit: "kWh/month",
        min: 0,
        max: 2000,
        step: 10,
        factor: 0.82, // For display only
        icon: <Zap className="w-5 h-5" />
      },
      {
        id: "ac_days",
        text: "Days You Run Your A/C",
        type: "number",
        unit: "days/month",
        min: 0,
        max: 31,
        step: 1,
        factor: 2.5, // For display only
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        id: "heat_days",
        text: "Days You Run Your Heat",
        type: "number",
        unit: "days/month",
        min: 0,
        max: 31,
        step: 1,
        factor: 2.0, // For display only
        icon: <Thermometer className="w-5 h-5" />
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
        text: "Laptop Use (Plugged In)",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 12,
        step: 1,
        factor: 0.05, // For display only
        icon: <Laptop className="w-5 h-5" />
      },
      {
        id: "tv_hours",
        text: "TV Hours Per Day",
        type: "number",
        unit: "hours",
        min: 0,
        max: 16,
        step: 1,
        factor: 0.04, // For display only
        icon: <Tv className="w-5 h-5" />
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
        text: "Number of Showers",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 0.5, // For display only
        icon: <Droplets className="w-5 h-5" />
      },
      {
        id: "laundry_per_month",
        text: "Laundry Loads",
        type: "number",
        unit: "per month",
        min: 0,
        max: 50,
        step: 1,
        factor: 0.3, // For display only
        icon: <Shirt className="w-5 h-5" />
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
        factor: 1.2, // For display only
        icon: <Beef className="w-5 h-5" />
      },
      {
        id: "vegetarian_meals",
        text: "Vegetarian Meals",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 0.3, // For display only
        icon: <Apple className="w-5 h-5" />
      }
    ]
  }
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState("transport");
  
  // 🔴 CHANGED: Store raw values only (no emissions)
  const [rawValues, setRawValues] = useState({});
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store factors from backend for display
  const [factors, setFactors] = useState({});

  // Load existing activities and factors
  useEffect(() => {
    fetchActivities();
    fetchFactors();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // NEW: Fetch factors from backend
  const fetchFactors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/emission-factors');
      const data = await response.json();
      
      // Convert array to object for easy lookup
      const factorMap = {};
      data.data.forEach(f => {
        factorMap[f.activityId] = f.factor;
      });
      setFactors(factorMap);
    } catch (error) {
      console.error("Error fetching factors:", error);
    }
  };

  // 🔴 CHANGED: Store only raw values
  const handleValueChange = (questionId, value) => {
    const numValue = parseFloat(value) || 0;
    
    setRawValues({
      ...rawValues,
      [questionId]: numValue
    });
  };

  // Calculate estimated emission for display (optional)
  const getEstimatedEmission = (questionId, value) => {
    if (!value || !factors[questionId]) return null;
    return (value * factors[questionId]).toFixed(2);
  };

  const hasAnyData = () => {
    return Object.keys(rawValues).length > 0;
  };

  // 🔴 CHANGED: Send raw values to backend
  const saveActivity = async () => {
    if (!hasAnyData()) {
      alert("Please add some data first");
      return;
    }

    setIsLoading(true);

    try {
      // Send ONLY raw values to backend
      const response = await activityAPI.create(rawValues);
      
      // Update local activities list
      setActivities(prev => [response.data.data, ...prev]);

      // Show success message with total from backend
      setSuccessMessage(`Activity saved! Total: ${response.data.data.totalEmissions} kg CO₂`);
      setShowSuccess(true);
      
      // Clear form after 2 seconds
      setTimeout(() => {
        setRawValues({});
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving activity:", error);
      alert(error.response?.data?.message || "Failed to save activity");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset current form only
  const resetCurrentForm = () => {
    if (hasAnyData()) {
      if (window.confirm("Clear all unsaved data in this form?")) {
        setRawValues({});
      }
    }
  };

  // Delete a specific activity
  const deleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityAPI.delete(activityId);
        
        const updatedActivities = activities.filter(a => a._id !== activityId);
        setActivities(updatedActivities);
        
        setShowDeleteOptions(false);
        setSuccessMessage("Activity deleted successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Failed to delete activity");
      }
    }
  };

  // Delete all activities
  const deleteAllActivities = async () => {
    if (window.confirm("Are you sure you want to delete ALL activities? This cannot be undone!")) {
      try {
        for (const activity of activities) {
          await activityAPI.delete(activity._id);
        }
        
        setActivities([]);
        setShowDeleteOptions(false);
        setSuccessMessage("All activities deleted");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (error) {
        console.error("Error deleting activities:", error);
        alert("Failed to delete activities");
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
              Fill in your data and click Save when done
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Save Button */}
          <button
            onClick={saveActivity}
            disabled={!hasAnyData() || isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm transition-all ${
              hasAnyData() && !isLoading
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
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

          {/* Reset Current Form */}
          {hasAnyData() && !isLoading && (
            <button
              onClick={resetCurrentForm}
              className="flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Form
            </button>
          )}

          {/* Delete Options Dropdown */}
          {activities.length > 0 && !isLoading && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Options
              </button>
              
              {showDeleteOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => setShowDeleteOptions(false)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel
                  </button>
                  
                  {activities.map(activity => (
                    <button
                      key={activity._id}
                      onClick={() => deleteActivity(activity._id)}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center justify-between"
                    >
                      <span>
                        {new Date(activity.date).toLocaleDateString()} - {activity.totalEmissions} kg
                      </span>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ))}
                  
                  {activities.length > 1 && (
                    <button
                      onClick={deleteAllActivities}
                      className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-100 font-semibold border-t flex items-center justify-between"
                    >
                      <span>Delete ALL Activities</span>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="bg-white rounded-xl shadow-sm p-2 inline-flex flex-wrap gap-2">
            {categories.map((cat) => {
              // Check if any values in this category
              const hasDataInCategory = Object.keys(rawValues).some(key => 
                questions[cat.id]?.questions.some(q => q.id === key) && rawValues[key] > 0
              );
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(cat.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentCategory === cat.id
                      ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-md`
                      : hasDataInCategory
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Questions Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${questions[currentCategory].color} text-white`}>
                  {questions[currentCategory].icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{questions[currentCategory].title}</h2>
                  <p className="text-sm text-gray-500">
                    Enter your usage below
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {questions[currentCategory].questions.map((q) => {
                  const currentValue = rawValues[q.id];
                  const estimatedEmission = getEstimatedEmission(q.id, currentValue);
                  
                  return (
                    <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
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
                              onChange={(e) => handleValueChange(q.id, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Enter ${q.unit}`}
                              disabled={isLoading}
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              {q.unit}
                            </span>
                          </div>

                          {/* Show estimated emission if we have factors */}
                          {estimatedEmission && (
                            <div className="mt-2">
                              <span className="text-sm text-green-600 font-medium">
                                ≈ {estimatedEmission} kg CO₂ (estimated)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    const index = categories.findIndex(c => c.id === currentCategory);
                    if (index > 0) {
                      setCurrentCategory(categories[index - 1].id);
                    }
                  }}
                  disabled={currentCategory === categories[0].id || isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <button
                  onClick={() => {
                    const index = categories.findIndex(c => c.id === currentCategory);
                    if (index < categories.length - 1) {
                      setCurrentCategory(categories[index + 1].id);
                    }
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
                >
                  Next Category
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary Column */}
          <div className="space-y-6">
            {/* Live Calculator */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Current Session
              </h3>
              
              <div className="space-y-4 mb-6">
                {Object.keys(rawValues).length > 0 ? (
                  Object.entries(rawValues).map(([id, value]) => {
                    // Find the question details
                    let questionDetails = null;
                    let categoryName = '';
                    
                    for (const cat of categories) {
                      const q = questions[cat.id]?.questions.find(q => q.id === id);
                      if (q) {
                        questionDetails = q;
                        categoryName = cat.label;
                        break;
                      }
                    }
                    
                    if (questionDetails && value > 0) {
                      return (
                        <div key={id} className="flex justify-between items-center">
                          <span className="text-gray-700">{questionDetails.text}</span>
                          <span className="font-medium text-gray-900">{value} {questionDetails.unit}</span>
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No data yet. Start adding values above.
                  </p>
                )}
              </div>

              {hasAnyData() && (
                <button
                  onClick={saveActivity}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save This Activity
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Recent Activities Preview */}
            {activities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {activities.slice(-3).reverse().map(activity => (
                    <div key={activity._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-gray-900">
                        {activity.totalEmissions} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Fill multiple categories before saving</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Backend calculates your exact carbon footprint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Delete individual activities from Delete Options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}