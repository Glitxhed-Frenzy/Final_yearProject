// src/frontend/pages/AddActivity.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Car, Plane, Train, Bus, Zap, Droplets, Thermometer,
  Tv, Laptop, Shirt, Apple, 
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Save,
  Trash2, RefreshCw, ArrowLeft, Clock
} from "lucide-react";
import { activityAPI } from '../../services/api';
import CarbonTips from "../components/CarbonTips";

// Categories
const categories = [
  { id: 'transport', label: 'Transportation', icon: <Car className="w-5 h-5" />, color: 'purple' },
  { id: 'electricity', label: 'Electricity', icon: <Zap className="w-5 h-5" />, color: 'blue' },
  { id: 'waste', label: 'Waste', icon: <Trash2 className="w-5 h-5" />, color: 'emerald' },
  { id: 'food', label: 'Food', icon: <Apple className="w-5 h-5" />, color: 'amber' }
];

// Questions
const questions = {
  transport: {
    title: "Transportation",
    icon: <Car className="w-6 h-6" />,
    color: "from-purple-500 to-violet-600",
    questions: [
      {
        id: "car_section",
        text: "Car",
        type: "section",
        icon: <Car className="w-5 h-5" />,
        collapsible: true,
        children: [
          {
            id: "car_type",
            text: "Car Type",
            type: "select",
            options: [
              { value: "hatchback", label: "Hatchback (e.g., Maruti Swift, Hyundai i10)" },
              { value: "sedan", label: "Sedan (e.g., Honda City, Toyota Camry)" },
              { value: "suv", label: "SUV (e.g., Hyundai Creta, Toyota Fortuner)" },
              { value: "muv", label: "MUV/MPV (e.g., Toyota Innova, Maruti Ertiga)" }
            ],
            icon: <Car className="w-5 h-5" />,
            helpText: "Select your car body type"
          },
          {
            id: "car_fuel",
            text: "Fuel Type",
            type: "select",
            options: [
              { value: "petrol", label: "Petrol" },
              { value: "diesel", label: "Diesel" },
              { value: "hybrid", label: "Hybrid" },
              { value: "electric", label: "Electric" }
            ],
            icon: <Car className="w-5 h-5" />,
            helpText: "Select your fuel type"
          },
          {
            id: "car_km",
            text: "Kilometers Driven",
            type: "number",
            unit: "km",
            min: 0,
            max: 8000,
            step: 10,
            icon: <Car className="w-5 h-5" />,
            helpText: "How many kilometers did you drive this month?"
          }
        ]
      },
      {
        id: "bus_km",
        text: "Bus Kilometers",
        type: "number",
        unit: "km",
        min: 0,
        max: 1600,
        step: 5,
        factor: 0.11,
        icon: <Bus className="w-5 h-5" />,
        helpText: "How many kilometers did you travel by bus?"
      },
      {
        id: "train_section",
        text: "Train",
        type: "section",
        icon: <Train className="w-5 h-5" />,
        collapsible: true,
        children: [
          {
            id: "train_type",
            text: "Train Type",
            type: "select",
            options: [
              { value: "local", label: "Local Train (Mumbai Suburban - e.g., Ghatkopar to Dadar)", factor: 0.025 },
              { value: "express", label: "Express/Mail Train (Long Distance - e.g., Mumbai to Delhi)", factor: 0.062 }
            ],
            icon: <Train className="w-5 h-5" />,
            helpText: "Select the type of train you used"
          },
          {
            id: "train_km",
            text: "Kilometers Traveled",
            type: "number",
            unit: "km",
            min: 0,
            max: 1600,
            step: 5,
            icon: <Train className="w-5 h-5" />,
            helpText: "How many kilometers did you travel by train?"
          }
        ]
      },
      {
        id: "plane_km",
        text: "Plane Kilometers",
        type: "number",
        unit: "km",
        min: 0,
        max: 16000,
        step: 100,
        factor: 0.33,
        icon: <Plane className="w-5 h-5" />,
        helpText: "How many kilometers did you fly?"
      }
    ]
  },
  
  electricity: {
    title: "Electricity Usage",
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-600",
    questions: [
      {
        id: "electricity_kwh",
        text: "Monthly Electricity Consumption",
        type: "number",
        unit: "kWh",
        min: 0,
        max: 5000,
        step: 50,
        factor: 0.85,
        icon: <Zap className="w-5 h-5" />,
        helpText: "Check your electricity bill for monthly kWh usage"
      },
      {
        id: "ac_hours",
        text: "AC Usage",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 2.0,
        icon: <Thermometer className="w-5 h-5" />,
        helpText: "How many hours per day do you use AC?"
      },
      {
        id: "heater_hours",
        text: "Heater Usage",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 2.8,
        icon: <Thermometer className="w-5 h-5" />,
        helpText: "How many hours per day do you use heating?"
      },
      {
        id: "laptop_hours",
        text: "Laptop/Desktop Usage",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 0.012,
        icon: <Laptop className="w-5 h-5" />,
        helpText: "Hours per day your computer is plugged in"
      },
      {
        id: "tv_hours",
        text: "TV Hours",
        type: "number",
        unit: "hours/day",
        min: 0,
        max: 24,
        step: 1,
        factor: 0.025,
        icon: <Tv className="w-5 h-5" />,
        helpText: "Hours per day you watch TV"
      }
    ]
  },
  
  waste: {
    title: "Waste Management",
    icon: <Trash2 className="w-6 h-6" />,
    color: "from-emerald-500 to-green-600",
    questions: [
      {
        id: "food_waste_kg",
        text: "Food Waste",
        type: "number",
        unit: "kg/week",
        min: 0,
        max: 50,
        step: 1,
        factor: 0.5,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How much food do you throw away per week? (in kg)"
      },
      {
        id: "plastic_waste_kg",
        text: "Plastic Waste",
        type: "number",
        unit: "kg/week",
        min: 0,
        max: 20,
        step: 1,
        factor: 3.0,
        icon: <Trash2 className="w-5 h-5" />,
        helpText: "How much plastic waste do you generate per week? (bottles, packaging, etc.)"
      },
      {
        id: "paper_waste_kg",
        text: "Paper/Cardboard Waste",
        type: "number",
        unit: "kg/week",
        min: 0,
        max: 20,
        step: 1,
        factor: 0.8,
        icon: <Trash2 className="w-5 h-5" />,
        helpText: "How much paper or cardboard do you dispose per week?"
      },
      {
        id: "metal_waste_kg",
        text: "Metal Waste",
        type: "number",
        unit: "kg/month",
        min: 0,
        max: 50,
        step: 1,
        factor: 2.5,
        icon: <Trash2 className="w-5 h-5" />,
        helpText: "How much metal waste do you dispose per month? (cans, foil, etc.)"
      },
      {
        id: "ewaste_kg",
        text: "Electronic Waste",
        type: "number",
        unit: "kg/year",
        min: 0,
        max: 100,
        step: 1,
        factor: 15.0,
        icon: <Laptop className="w-5 h-5" />,
        helpText: "How much electronic waste do you dispose per year? (old phones, laptops, etc.)"
      },
      {
        id: "recycling_rate",
        text: "Recycling Rate",
        type: "select",
        options: [
          { value: "low", label: "Low (0-20% recycled)", factor: 1.0 },
          { value: "medium", label: "Medium (20-50% recycled)", factor: 0.7 },
          { value: "high", label: "High (50-80% recycled)", factor: 0.4 },
          { value: "very_high", label: "Very High (80-100% recycled)", factor: 0.2 }
        ],
        icon: <RefreshCw className="w-5 h-5" />,
        helpText: "What percentage of your waste do you recycle?"
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
        max: 14,
        step: 1,
        factor: 6.9,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How many chicken meals per week?"
      },
      {
        id: "fish_servings",
        text: "Fish Servings",
        type: "number",
        unit: "per week",
        min: 0,
        max: 14,
        step: 1,
        factor: 3.5,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How many fish meals per week?"
      },
      {
        id: "dairy_servings",
        text: "Dairy Servings (Milk, Cheese, Yogurt)",
        type: "number",
        unit: "per week",
        min: 0,
        max: 21,
        step: 1,
        factor: 2.5,
        icon: <Apple className="w-5 h-5" />,
        helpText: "How many dairy servings per week?"
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
      },
      {
        id: "food_waste",
        text: "Food Waste",
        type: "select",
        options: [
          { value: "low", label: "Low (0-10% waste)", factor: 1.0 },
          { value: "medium", label: "Medium (10-25% waste)", factor: 1.15 },
          { value: "high", label: "High (25-50% waste)", factor: 1.30 }
        ],
        icon: <Apple className="w-5 h-5" />,
        helpText: "How much food do you typically waste?"
      }
    ]
  }
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState("transport");
  const [values, setValues] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    car_section: false,
    train_section: false
  });
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [selectedCarFuel, setSelectedCarFuel] = useState(null);
  const [selectedTrainType, setSelectedTrainType] = useState(null);
  const [selectedFoodWaste, setSelectedFoodWaste] = useState(null);
  const [selectedRecyclingRate, setSelectedRecyclingRate] = useState(null);
  const [stats, setStats] = useState({
    total: null,
    transport: null,
    electricity: null,
    waste: null,
    food: null
  });
  
  const carFactorMap = {
    hatchback_petrol: 0.124,
    hatchback_diesel: 0.106,
    sedan_petrol: 0.162,
    sedan_diesel: 0.143,
    sedan_hybrid: 0.099,
    sedan_electric: 0.062,
    suv_petrol: 0.217,
    suv_diesel: 0.193,
    suv_hybrid: 0.137,
    suv_electric: 0.087,
    muv_petrol: 0.199,
    muv_diesel: 0.174,
    muv_hybrid: 0.124,
    muv_electric: 0.081
  };
  
  const trainFactorMap = {
    local: 0.025,
    express: 0.062
  };
  
  const foodWasteMultiplierMap = {
    low: 1.0,
    medium: 1.15,
    high: 1.30
  };
  
  const recyclingMultiplierMap = {
    low: 1.0,
    medium: 0.7,
    high: 0.4,
    very_high: 0.2
  };
  
  const getCarFactor = () => {
    if (!selectedCarType || !selectedCarFuel) return null;
    const key = `${selectedCarType}_${selectedCarFuel}`;
    return carFactorMap[key] || null;
  };
  
  const getTrainFactor = () => {
    if (!selectedTrainType) return null;
    return trainFactorMap[selectedTrainType] || null;
  };
  
  const getFoodWasteMultiplier = () => {
    if (!selectedFoodWaste) return 1.0;
    return foodWasteMultiplierMap[selectedFoodWaste] || 1.0;
  };
  
  const getRecyclingMultiplier = () => {
    if (!selectedRecyclingRate) return 1.0;
    return recyclingMultiplierMap[selectedRecyclingRate] || 1.0;
  };
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await activityAPI.getStats();
      const statsData = response.data.data || {};
      const categoryTotals = statsData.categoryTotals || {};
      
      setStats({
        total: statsData.totalEmissions || null,
        transport: categoryTotals.transport || null,
        electricity: categoryTotals.electricity || null,
        waste: categoryTotals.waste || null,
        food: categoryTotals.food || null
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (questionId, value, question) => {
    setValues(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (questionId === "car_type") setSelectedCarType(value);
    if (questionId === "car_fuel") setSelectedCarFuel(value);
    if (questionId === "train_type") setSelectedTrainType(value);
    if (questionId === "food_waste") setSelectedFoodWaste(value);
    if (questionId === "recycling_rate") setSelectedRecyclingRate(value);
  };

  const getEstimatedEmission = (questionId, value, question) => {
    if (!value || value <= 0) return null;
    
    if (questionId === "car_km") {
      const carFactor = getCarFactor();
      if (carFactor) return (value * carFactor).toFixed(2);
      return null;
    }
    
    if (questionId === "train_km") {
      const trainFactor = getTrainFactor();
      if (trainFactor) return (value * trainFactor).toFixed(2);
      return null;
    }
    
    if (["food_waste_kg", "plastic_waste_kg", "paper_waste_kg", "metal_waste_kg", "ewaste_kg"].includes(questionId)) {
      const recyclingMultiplier = getRecyclingMultiplier();
      if (question?.factor) return (value * question.factor * recyclingMultiplier).toFixed(2);
    }
    
    if (["chicken_servings", "fish_servings", "dairy_servings", "vegetarian_meals"].includes(questionId)) {
      const wasteMultiplier = getFoodWasteMultiplier();
      if (question?.factor) return (value * question.factor * wasteMultiplier).toFixed(2);
    }
    
    if (question?.factor) return (value * question.factor).toFixed(2);
    
    return null;
  };

  const hasAnyData = () => {
    return Object.keys(values).some(key => values[key] > 0);
  };

  const saveActivity = async () => {
    if (!hasAnyData()) {
      alert("Please add some data first");
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend = {};
      Object.keys(values).forEach(key => {
        if (values[key] > 0) {
          dataToSend[key] = values[key];
        }
      });
      
      if (selectedCarType && selectedCarFuel) {
        dataToSend.car_type = selectedCarType;
        dataToSend.car_fuel = selectedCarFuel;
      }
      
      if (selectedTrainType) dataToSend.train_type = selectedTrainType;
      if (selectedFoodWaste) dataToSend.food_waste = selectedFoodWaste;
      if (selectedRecyclingRate) dataToSend.recycling_rate = selectedRecyclingRate;

      // FIXED: Send local date with timezone offset
      const now = new Date();
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      dataToSend.date = localDate.toISOString();

      const response = await activityAPI.create(dataToSend);
      
      setActivities(prev => [response.data.data, ...prev]);
      fetchStats();
      
      let total = 0;
      const wasteMultiplier = getFoodWasteMultiplier();
      const recyclingMultiplier = getRecyclingMultiplier();
      
      Object.keys(values).forEach(key => {
        if (key === "car_km") {
          const carFactor = getCarFactor();
          if (carFactor && values[key] > 0) total += values[key] * carFactor;
        } else if (key === "train_km") {
          const trainFactor = getTrainFactor();
          if (trainFactor && values[key] > 0) total += values[key] * trainFactor;
        } else if (["food_waste_kg", "plastic_waste_kg", "paper_waste_kg", "metal_waste_kg", "ewaste_kg"].includes(key)) {
          const question = findQuestion(key);
          if (question && values[key] > 0 && question.factor) total += values[key] * question.factor * recyclingMultiplier;
        } else if (["chicken_servings", "fish_servings", "dairy_servings", "vegetarian_meals"].includes(key)) {
          const question = findQuestion(key);
          if (question && values[key] > 0 && question.factor) total += values[key] * question.factor * wasteMultiplier;
        } else {
          const question = findQuestion(key);
          if (question && values[key] > 0 && question.factor) total += values[key] * question.factor;
        }
      });
      
      setSuccessMessage(`Activity saved! Total: ${total.toFixed(2)} kg CO₂`);
      setShowSuccess(true);
      
      setTimeout(() => {
        setValues({});
        setSelectedCarType(null);
        setSelectedCarFuel(null);
        setSelectedTrainType(null);
        setSelectedFoodWaste(null);
        setSelectedRecyclingRate(null);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving activity:", error);
      alert(error.response?.data?.message || "Failed to save activity");
    } finally {
      setIsLoading(false);
    }
  };

  const findQuestion = (questionId) => {
    for (const cat of Object.values(questions)) {
      const q = cat.questions.find(q => q.id === questionId);
      if (q) return q;
      
      for (const section of cat.questions) {
        if (section.type === "section" && section.children) {
          const childQ = section.children.find(c => c.id === questionId);
          if (childQ) return childQ;
        }
      }
    }
    return null;
  };

  const resetForm = () => {
    if (hasAnyData()) {
      if (window.confirm("Clear all data?")) {
        setValues({});
        setSelectedCarType(null);
        setSelectedCarFuel(null);
        setSelectedTrainType(null);
        setSelectedFoodWaste(null);
        setSelectedRecyclingRate(null);
      }
    }
  };

  const deleteActivity = async (activityId) => {
    if (window.confirm("Delete this activity?")) {
      try {
        await activityAPI.delete(activityId);
        setActivities(prev => prev.filter(a => a._id !== activityId));
        fetchStats();
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

  const getCarTypeLabel = (value) => {
    const carType = questions.transport.questions
      .find(q => q.id === "car_section")?.children
      ?.find(c => c.id === "car_type")?.options
      ?.find(opt => opt.value === value);
    return carType?.label || value;
  };
  
  const getCarFuelLabel = (value) => {
    const carFuel = questions.transport.questions
      .find(q => q.id === "car_section")?.children
      ?.find(c => c.id === "car_fuel")?.options
      ?.find(opt => opt.value === value);
    return carFuel?.label || value;
  };
  
  const getTrainTypeLabel = (value) => {
    const trainType = questions.transport.questions
      .find(q => q.id === "train_section")?.children
      ?.find(c => c.id === "train_type")?.options
      ?.find(opt => opt.value === value);
    return trainType?.label || value;
  };
  
  const getFoodWasteLabel = (value) => {
    const wasteOption = questions.food.questions
      .find(q => q.id === "food_waste")?.options
      ?.find(opt => opt.value === value);
    return wasteOption?.label || value;
  };
  
  const getRecyclingRateLabel = (value) => {
    const rateOption = questions.waste.questions
      .find(q => q.id === "recycling_rate")?.options
      ?.find(opt => opt.value === value);
    return rateOption?.label || value;
  };

  return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-down">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Activity</h1>
          <p className="text-gray-600 mt-2">Enter your monthly usage below</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
      </div>

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
          <button onClick={resetForm} className="flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200">
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        )}

        {activities.length > 0 && !isLoading && (
          <div className="relative">
            <button onClick={() => setShowDeleteOptions(!showDeleteOptions)} className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            
            {showDeleteOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 z-50">
                <button onClick={() => setShowDeleteOptions(false)} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 border-b">
                  ← Cancel
                </button>
                {activities.slice(0, 5).map(activity => (
                  <button key={activity._id} onClick={() => deleteActivity(activity._id)} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex justify-between">
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                    <span>{activity.totalEmissions} kg</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="bg-white rounded-xl shadow-sm p-2 inline-flex gap-2">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCurrentCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentCategory === cat.id ? `bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 text-white` : 'text-gray-600 hover:bg-gray-100'
            }`}>
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Questionnaire Form + Recent Activities */}
        <div className="lg:col-span-2">
          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${questions[currentCategory].color} text-white`}>
                {questions[currentCategory].icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{questions[currentCategory].title}</h2>
            </div>

            <div className="space-y-6">
              {questions[currentCategory].questions.map((q) => {
                if (q.type === "section") {
                  const isExpanded = expandedSections[q.id];
                  
                  return (
                    <div key={q.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => toggleSection(q.id)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-200 rounded-lg">{q.icon}</div>
                          <span className="font-semibold text-gray-900">{q.text}</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 space-y-4 border-t border-gray-100">
                          {q.children.map((childQ) => {
                            const currentValue = values[childQ.id];
                            const emission = getEstimatedEmission(childQ.id, currentValue, childQ);
                            
                            return (
                              <div key={childQ.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-gray-100 rounded-lg">{childQ.icon}</div>
                                  <div className="flex-1">
                                    <label className="block font-medium text-gray-900 mb-2">{childQ.text}</label>
                                    
                                    {childQ.type === "select" ? (
                                      <select value={values[childQ.id] || ''} onChange={(e) => handleInputChange(childQ.id, e.target.value, childQ)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 bg-white" disabled={isLoading}>
                                        <option value="">Select {childQ.text}</option>
                                        {childQ.options.map((option) => (
                                          <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <div className="relative">
                                        <input type="number" min={childQ.min} max={childQ.max} step={childQ.step} value={currentValue || ''} onChange={(e) => handleInputChange(childQ.id, e.target.value, childQ)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" placeholder={`Enter ${childQ.unit}`} disabled={isLoading} />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{childQ.unit}</span>
                                      </div>
                                    )}

                                    {childQ.helpText && <p className="text-xs text-gray-500 mt-2">💡 {childQ.helpText}</p>}
                                    {emission && <p className="text-sm text-green-600 font-medium mt-2">≈ {emission} kg CO₂</p>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                const currentValue = values[q.id];
                const emission = getEstimatedEmission(q.id, currentValue, q);
                
                return (
                  <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">{q.icon}</div>
                      <div className="flex-1">
                        <label className="block font-medium text-gray-900 mb-2">{q.text}</label>
                        
                        {q.type === "select" ? (
                          <select value={values[q.id] || ''} onChange={(e) => handleInputChange(q.id, e.target.value, q)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 bg-white" disabled={isLoading}>
                            <option value="">Select {q.text}</option>
                            {q.options.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <input type="number" min={q.min} max={q.max} step={q.step} value={currentValue || ''} onChange={(e) => handleInputChange(q.id, e.target.value, q)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500" placeholder={`Enter ${q.unit}`} disabled={isLoading} />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{q.unit}</span>
                          </div>
                        )}

                        {q.helpText && <p className="text-xs text-gray-500 mt-2">💡 {q.helpText}</p>}
                        {emission && <p className="text-sm text-green-600 font-medium mt-2">≈ {emission} kg CO₂</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT ACTIVITIES - Now below the form on the left side */}
          {activities.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Recent</h3>
              <div className="space-y-2">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{new Date(activity.date).toLocaleDateString()}</span>
                    <span className="font-medium">{activity.totalEmissions} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Summary & Tips */}
        <div className="lg:col-span-1">
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
                    
                    if (id === "car_type") return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">Car Type</span><span className="font-medium">{getCarTypeLabel(val)}</span></div>;
                    if (id === "car_fuel") return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">Fuel Type</span><span className="font-medium">{getCarFuelLabel(val)}</span></div>;
                    if (id === "train_type") return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">Train Type</span><span className="font-medium">{getTrainTypeLabel(val)}</span></div>;
                    if (id === "food_waste") return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">Food Waste</span><span className="font-medium">{getFoodWasteLabel(val)}</span></div>;
                    if (id === "recycling_rate") return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">Recycling Rate</span><span className="font-medium">{getRecyclingRateLabel(val)}</span></div>;
                    
                    const q = findQuestion(id);
                    if (!q) return null;
                    
                    return <div key={id} className="flex justify-between text-sm"><span className="text-gray-600">{q.text}</span><span className="font-medium">{val} {q.unit || ''}</span></div>;
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No data yet</p>
                )}
              </div>

              {hasAnyData() && (
                <button onClick={saveActivity} disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Saving...' : 'Save Activity'}
                </button>
              )}
            </div>

            {/* Tips Section */}
            {stats && stats.total !== null && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <CarbonTips stats={stats} activities={activities} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}