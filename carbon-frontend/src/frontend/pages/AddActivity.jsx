// src/frontend/pages/AddActivity.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Car, 
  Plane, 
  Train, 
  Bus,
  Zap, 
  Droplets,
  Thermometer,
  Tv,
  Laptop,
  Smartphone,
  Shirt,
  Beef,
  Apple,
  Coffee,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const questions = {
  // ============ TRANSPORTATION ============
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
        factor: 0.20, // kg CO2 per mile
        icon: <Car className="w-5 h-5" />
      },
      {
        id: "car_type",
        text: "Car Type",
        type: "select",
        options: [
          { value: "small", label: "Small Car (40+ mpg)", factor: 0.15 },
          { value: "medium", label: "Medium Car (25-39 mpg)", factor: 0.20 },
          { value: "suv", label: "SUV (15-24 mpg)", factor: 0.30 },
          { value: "truck", label: "Truck (10-14 mpg)", factor: 0.35 },
          { value: "hybrid", label: "Hybrid", factor: 0.12 },
          { value: "electric", label: "Electric", factor: 0.05 }
        ],
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

  // ============ HOME ENERGY ============
  home: {
    title: "Home Energy",
    icon: <Home className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-600",
    questions: [
      {
        id: "square_feet",
        text: "Square Feet of Your Residence",
        type: "select",
        options: [
          { value: "<500", label: "< 500 sq ft", factor: 0.5 },
          { value: "500-1000", label: "500 - 1,000 sq ft", factor: 0.8 },
          { value: "1000-1500", label: "1,000 - 1,500 sq ft", factor: 1.2 },
          { value: "1500-2000", label: "1,500 - 2,000 sq ft", factor: 1.5 },
          { value: "2000-2500", label: "2,000 - 2,500 sq ft", factor: 1.8 },
          { value: ">2500", label: "> 2,500 sq ft", factor: 2.2 }
        ],
        icon: <Home className="w-5 h-5" />
      },
      {
        id: "fridge",
        text: "Fridge",
        type: "boolean",
        options: [
          { value: "yes", label: "Yes", factor: 1.0 },
          { value: "no", label: "No", factor: 0 }
        ],
        icon: <Zap className="w-5 h-5" />
      },
      {
        id: "ac_days",
        text: "Days You Run Your A/C (at Full Blast)",
        type: "number",
        unit: "days/month",
        min: 0,
        max: 31,
        step: 1,
        factor: 2.5, // per day
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        id: "heat_gas_days",
        text: "Days You Run Your Heat (Natural Gas)",
        type: "number",
        unit: "days/month",
        min: 0,
        max: 31,
        step: 1,
        factor: 1.8,
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        id: "heat_oil_days",
        text: "Days You Run Your Heat (Oil)",
        type: "number",
        unit: "days/month",
        min: 0,
        max: 31,
        step: 1,
        factor: 2.2,
        icon: <Thermometer className="w-5 h-5" />
      }
    ]
  },

  // ============ ELECTRONICS ============
  electronics: {
    title: "Electronics Usage",
    icon: <Laptop className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
    questions: [
      {
        id: "laptop_hours",
        text: "Hours of Laptop Use (Plugged In) Per Day",
        type: "range",
        min: 0,
        max: 12,
        step: 1,
        marks: [0, 2, 4, 6, 8, 10, 12],
        factor: 0.05, // per hour
        icon: <Laptop className="w-5 h-5" />
      },
      {
        id: "desktop_hours",
        text: "Hours of Desktop Use Per Day",
        type: "range",
        min: 0,
        max: 12,
        step: 1,
        marks: [0, 2, 4, 6, 8, 10, 12],
        factor: 0.15, // per hour
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: "monitor_hours",
        text: "Hours of Monitor Use Per Day",
        type: "number",
        unit: "hours",
        min: 0,
        max: 16,
        step: 1,
        factor: 0.03,
        icon: <Tv className="w-5 h-5" />
      },
      {
        id: "tv_hours",
        text: "Hours of TV Per Day",
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

  // ============ WATER USAGE ============
  water: {
    title: "Water Consumption",
    icon: <Droplets className="w-6 h-6" />,
    color: "from-cyan-500 to-teal-600",
    questions: [
      {
        id: "showers_per_week",
        text: "Number of Showers Per Week",
        type: "number",
        unit: "showers",
        min: 0,
        max: 21,
        step: 1,
        factor: 0.5, // per shower
        icon: <Droplets className="w-5 h-5" />
      },
      {
        id: "shower_minutes",
        text: "Time Spent in the Shower (Minutes)",
        type: "number",
        unit: "minutes",
        min: 0,
        max: 60,
        step: 5,
        factor: 0.1, // per minute
        icon: <Droplets className="w-5 h-5" />
      },
      {
        id: "flushes_per_day",
        text: "Number of Flushes Per Day",
        type: "number",
        unit: "flushes",
        min: 0,
        max: 20,
        step: 1,
        factor: 0.2,
        icon: <Droplets className="w-5 h-5" />
      },
      {
        id: "laundry_per_month",
        text: "Loads of Laundry Per Month",
        type: "number",
        unit: "loads",
        min: 0,
        max: 50,
        step: 1,
        factor: 0.3,
        icon: <Shirt className="w-5 h-5" />
      },
      {
        id: "bottled_water",
        text: "Bottles of Water From the Sink Per Day",
        type: "number",
        unit: "bottles",
        min: 0,
        max: 10,
        step: 1,
        factor: 0.05,
        icon: <Coffee className="w-5 h-5" />
      }
    ]
  },

  // ============ FOOD & DIET ============
  food: {
    title: "Food & Diet",
    icon: <Apple className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
    questions: [
      {
        id: "beef_servings",
        text: "Beef Servings Per Week",
        type: "number",
        unit: "servings",
        min: 0,
        max: 21,
        step: 1,
        factor: 3.5, // per serving
        icon: <Beef className="w-5 h-5" />
      },
      {
        id: "chicken_servings",
        text: "Chicken Servings Per Week",
        type: "number",
        unit: "servings",
        min: 0,
        max: 21,
        step: 1,
        factor: 1.2,
        icon: <Beef className="w-5 h-5" />
      },
      {
        id: "pork_servings",
        text: "Pork Servings Per Week",
        type: "number",
        unit: "servings",
        min: 0,
        max: 21,
        step: 1,
        factor: 1.8,
        icon: <Beef className="w-5 h-5" />
      },
      {
        id: "vegetarian_meals",
        text: "Vegetarian Meals Per Week",
        type: "number",
        unit: "meals",
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
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId, value, factor) => {
    let emission = 0;
    
    if (typeof value === 'number' || !isNaN(parseFloat(value))) {
      const numValue = parseFloat(value) || 0;
      emission = numValue * factor;
    } else if (typeof value === 'string') {
      // For select options, find the selected option and its factor
      const category = questions[currentCategory];
      const question = category.questions.find(q => q.id === questionId);
      if (question && question.options) {
        const selectedOption = question.options.find(opt => opt.value === value);
        emission = selectedOption?.factor || 0;
      }
    }
    
    setAnswers({
      ...answers,
      [questionId]: {
        value,
        emission,
        category: currentCategory
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
    return total.toFixed(2);
  };

  const calculateGrandTotal = () => {
    let total = 0;
    Object.keys(answers).forEach(key => {
      total += answers[key].emission;
    });
    return total.toFixed(2);
  };

  const handleSubmit = () => {
    // Save to localStorage
    const activities = JSON.parse(localStorage.getItem('carbon_activities') || '[]');
    
    const newActivity = {
      id: Date.now(),
      date: new Date().toISOString(),
      category: currentCategory,
      answers: { ...answers },
      totalEmissions: calculateGrandTotal(),
      categoryTotals: {
        transport: calculateCategoryTotal('transport'),
        home: calculateCategoryTotal('home'),
        electronics: calculateCategoryTotal('electronics'),
        water: calculateCategoryTotal('water'),
        food: calculateCategoryTotal('food')
      }
    };
    
    activities.push(newActivity);
    localStorage.setItem('carbon_activities', JSON.stringify(activities));
    
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const categories = [
    { id: 'transport', label: 'Transportation', icon: <Car className="w-5 h-5" />, color: 'purple' },
    { id: 'home', label: 'Home Energy', icon: <Home className="w-5 h-5" />, color: 'blue' },
    { id: 'electronics', label: 'Electronics', icon: <Laptop className="w-5 h-5" />, color: 'indigo' },
    { id: 'water', label: 'Water Usage', icon: <Droplets className="w-5 h-5" />, color: 'cyan' },
    { id: 'food', label: 'Food & Diet', icon: <Apple className="w-5 h-5" />, color: 'amber' }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Added!</h2>
          <p className="text-gray-600 mb-6">
            Your carbon footprint has been calculated and saved.
          </p>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Total Emissions</p>
            <p className="text-4xl font-bold text-green-700">{calculateGrandTotal()} kg</p>
            <p className="text-sm text-gray-500 mt-2">CO₂ equivalent</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carbon Footprint Questionnaire</h1>
          <p className="text-gray-600 mt-2">
            Answer these questions to calculate your monthly carbon footprint
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 inline-flex flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentCategory === cat.id
                    ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white shadow-md`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
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
                  <p className="text-sm text-gray-500">Complete all questions below</p>
                </div>
              </div>

              <div className="space-y-8">
                {questions[currentCategory].questions.map((q, idx) => (
                  <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        {q.icon}
                      </div>
                      <div className="flex-1">
                        <label className="block font-medium text-gray-900 mb-2">
                          {q.text}
                        </label>
                        
                        {/* Different input types */}
                        {q.type === 'select' && (
                          <select
                            onChange={(e) => handleAnswerChange(q.id, e.target.value, 0)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Select an option</option>
                            {q.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {q.type === 'boolean' && (
                          <div className="flex gap-4">
                            {q.options.map((opt) => (
                              <label key={opt.value} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt.value}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value, 0)}
                                  className="w-4 h-4 text-green-600"
                                />
                                <span className="text-gray-700">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'range' && (
                          <div>
                            <input
                              type="range"
                              min={q.min}
                              max={q.max}
                              step={q.step}
                              onChange={(e) => handleAnswerChange(q.id, parseInt(e.target.value), q.factor)}
                              className="w-full"
                            />
                            <div className="flex justify-between mt-2">
                              {q.marks.map((mark) => (
                                <span key={mark} className="text-xs text-gray-500">{mark}h</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.type === 'number' && (
                          <div className="relative">
                            <input
                              type="number"
                              min={q.min}
                              max={q.max}
                              step={q.step}
                              onChange={(e) => handleAnswerChange(q.id, parseFloat(e.target.value), q.factor)}
                              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Enter ${q.unit}`}
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              {q.unit}
                            </span>
                          </div>
                        )}

                        {/* Show emission for this question */}
                        {answers[q.id] && (
                          <div className="mt-2 text-sm">
                            <span className="text-green-600 font-medium">
                              ↳ {answers[q.id].emission.toFixed(2)} kg CO₂
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                  disabled={currentCategory === categories[0].id}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                {currentCategory === categories[categories.length - 1].id ? (
                  <button
                    onClick={() => setShowSummary(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700"
                  >
                    View Summary
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const index = categories.findIndex(c => c.id === currentCategory);
                      setCurrentCategory(categories[index + 1].id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
                  >
                    Next Category
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary Column */}
          <div className="space-y-6">
            {/* Real-time Carbon Calculator */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Live Carbon Calculator
              </h3>
              
              <div className="space-y-4">
                {categories.map((cat) => {
                  const total = calculateCategoryTotal(cat.id);
                  if (parseFloat(total) > 0) {
                    return (
                      <div key={cat.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{cat.label}</span>
                        <span className="font-medium text-gray-900">{total} kg</span>
                      </div>
                    );
                  }
                  return null;
                })}
                
                <div className="border-t border-green-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Footprint</span>
                    <span className="text-2xl font-bold text-green-700">
                      {calculateGrandTotal()} kg
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    CO₂ equivalent per month
                  </p>
                </div>
              </div>

              {showSummary && (
                <button
                  onClick={handleSubmit}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium"
                >
                  Submit All Answers
                </button>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Taking shorter showers saves water and energy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Unplug electronics when not in use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Carpooling reduces emissions by 50% per person</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}