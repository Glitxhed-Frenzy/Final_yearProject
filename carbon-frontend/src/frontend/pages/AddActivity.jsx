// src/frontend/pages/AddActivity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Car, Plane, Train, Bus, Zap, Droplets, Thermometer,
  Tv, Laptop, Smartphone, Shirt, Beef, Apple, Coffee,
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Save,
  Trash2, RefreshCw, ArrowLeft
} from "lucide-react";
import { activityAPI } from '../../services/api'; // ADD THIS IMPORT

const categories = [
  { id: 'transport', label: 'Transportation', icon: <Car className="w-5 h-5" />, color: 'purple' },
  { id: 'home', label: 'Home Energy', icon: <Home className="w-5 h-5" />, color: 'blue' },
  { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-5 h-5" />, color: 'indigo' },
  { id: 'water', label: 'Water Usage', icon: <Droplets className="w-5 h-5" />, color: 'cyan' },
  { id: 'food', label: 'Food & Diet', icon: <Apple className="w-5 h-5" />, color: 'amber' }
];

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
        factor: 0.20,
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
        factor: 0.08,
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
        factor: 0.05,
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
        factor: 0.25,
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
        factor: 0.82,
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
        factor: 2.5,
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
        factor: 2.0,
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
        factor: 0.05,
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
        factor: 0.04,
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
        factor: 0.5,
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
        factor: 0.3,
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
        id: "beef_servings",
        text: "Beef Servings",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 3.5,
        icon: <Beef className="w-5 h-5" />
      },
      {
        id: "chicken_servings",
        text: "Chicken Servings",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 1.2,
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
        factor: 0.3,
        icon: <Apple className="w-5 h-5" />
      }
    ]
  }
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState("transport");
  const [answers, setAnswers] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ADD THIS

  // Load existing activities from BACKEND
  useEffect(() => {
    fetchActivities();
  }, []);

  // ADD THIS NEW FUNCTION
  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleAnswerChange = (questionId, value, factor) => {
    const numValue = parseFloat(value) || 0;
    const emission = numValue * factor;
    
    setAnswers({
      ...answers,
      [questionId]: {
        value: numValue,
        emission,
        category: currentCategory,
        questionText: questions[currentCategory].questions.find(q => q.id === questionId)?.text,
        factor: factor
      }
    });
  };

  const calculateCategoryTotal = (categoryId) => {
    let total = 0;
    Object.keys(answers).forEach(key => {
      if (answers[key].category === categoryId) {
        total += answers[key].emission;
      }
    });
    return Math.round(total * 100) / 100;
  };

  const calculateGrandTotal = () => {
    let total = 0;
    Object.keys(answers).forEach(key => {
      total += answers[key].emission;
    });
    return Math.round(total * 100) / 100;
  };

  const hasAnyData = () => {
    return Object.keys(answers).length > 0;
  };

  // UPDATED: Save activity to BACKEND
  const saveActivity = async () => {
    if (!hasAnyData()) {
      alert("Please add some data first");
      return;
    }

    setIsLoading(true);

    // Calculate totals per category
    const categoryTotals = {};
    categories.forEach(cat => {
      const total = calculateCategoryTotal(cat.id);
      if (total > 0) {
        categoryTotals[cat.id] = total;
      }
    });

    // Create activity object for backend
    const activityData = {
      date: new Date().toISOString(),
      answers: { ...answers },
      categoryTotals,
      totalEmissions: calculateGrandTotal(),
      categories: Object.keys(categoryTotals)
    };

    try {
      // Save to backend
      const response = await activityAPI.create(activityData);
      
      // Update local activities list
      setActivities(prev => [response.data.data, ...prev]);

      // Show success message
      setSuccessMessage(`Activity saved! Total: ${calculateGrandTotal()} kg CO₂`);
      setShowSuccess(true);
      
      // Clear form after 2 seconds
      setTimeout(() => {
        setAnswers({});
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
        setAnswers({});
      }
    }
  };

  // UPDATED: Delete a specific activity from BACKEND
  const deleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityAPI.delete(activityId);
        
        // Update local state
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

  // UPDATED: Delete all activities from BACKEND
  const deleteAllActivities = async () => {
    if (window.confirm("Are you sure you want to delete ALL activities? This cannot be undone!")) {
      try {
        // Delete one by one
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

        {/* Header with back button */}
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
          {/* Save Button - Primary Action */}
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
                Save Activity ({calculateGrandTotal()} kg)
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
              const hasDataInCategory = Object.keys(answers).some(key => answers[key].category === cat.id);
              const categoryTotal = calculateCategoryTotal(cat.id);
              
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
                  {hasDataInCategory && (
                    <span className="ml-1 text-xs font-bold">
                      ({categoryTotal} kg)
                    </span>
                  )}
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
                    {calculateCategoryTotal(currentCategory) > 0 
                      ? `Current total: ${calculateCategoryTotal(currentCategory)} kg CO₂` 
                      : 'Enter values below'}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {questions[currentCategory].questions.map((q) => {
                  const currentAnswer = answers[q.id];
                  
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
                              value={currentAnswer?.value || ''}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value, q.factor)}
                              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Enter ${q.unit}`}
                              disabled={isLoading}
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              {q.unit}
                            </span>
                          </div>

                          {/* Live emission calculation */}
                          {currentAnswer && currentAnswer.value > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm text-green-600 font-medium">
                                → {currentAnswer.emission.toFixed(2)} kg CO₂
                              </span>
                              <span className="text-xs text-gray-500">
                                ({currentAnswer.value} × {q.factor})
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
                {categories.map((cat) => {
                  const total = calculateCategoryTotal(cat.id);
                  
                  if (total > 0) {
                    return (
                      <div key={cat.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{cat.label}</span>
                        <span className="font-medium text-gray-900">{total} kg</span>
                      </div>
                    );
                  }
                  return null;
                })}
                
                {!hasAnyData() && (
                  <p className="text-gray-500 text-center py-4">
                    No data yet. Start adding values above.
                  </p>
                )}
              </div>

              {hasAnyData() && (
                <>
                  <div className="border-t border-green-200 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-700">
                        {calculateGrandTotal()} kg
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      CO₂ equivalent per month
                    </p>
                  </div>

                  {/* Quick Save Button */}
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
                </>
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
                  <span>Use Reset Form to clear current data</span>
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