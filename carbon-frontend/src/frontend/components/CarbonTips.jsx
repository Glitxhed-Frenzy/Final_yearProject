// src/frontend/components/CarbonTips.jsx
import { useState, useEffect } from "react";
import { 
  Lightbulb, Car, Zap, Laptop, Trash2, Apple, RefreshCw, Leaf,
  AlertTriangle, CheckCircle, Thermometer, Tv, Bus, Train, Plane
} from "lucide-react";

export default function CarbonTips({ stats, activities, currentValues = {} }) {
  const [tips, setTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    generateTips();
  }, [stats, selectedCategory, currentValues]);

  const generateTips = () => {
    const newTips = [];

    // ---------- PER-ACTIVITY TIPS (based on currentValues) ----------

    if (currentValues.car_km > 50) {
      newTips.push({
        id: "car_high",
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚗 High Car Usage",
        message: `You entered ${currentValues.car_km} km by car today. Consider carpooling or public transport.`,
        impact: "Save up to 50% on transport emissions",
        action: "Try carpooling twice a week",
        color: "purple"
      });
    } else if (currentValues.car_km > 20) {
      newTips.push({
        id: "car_moderate",
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚗 Moderate Car Usage",
        message: `${currentValues.car_km} km by car. Combine trips or walk for short distances.`,
        impact: "Save 10-20% on fuel",
        action: "Walk for trips under 1 km",
        color: "blue"
      });
    }

    if (currentValues.bus_km > 20) {
      newTips.push({
        id: "bus_good",
        category: "transport",
        icon: <Bus className="w-5 h-5" />,
        title: "🚌 Great Public Transport Use",
        message: `${currentValues.bus_km} km by bus. That's very eco‑friendly!`,
        impact: "Lower emissions than car",
        action: "Share your habit with friends",
        color: "green"
      });
    }

    if (currentValues.train_km > 30) {
      newTips.push({
        id: "train_good",
        category: "transport",
        icon: <Train className="w-5 h-5" />,
        title: "🚆 Train Travel",
        message: `${currentValues.train_km} km by train. Trains are highly efficient.`,
        impact: "Much lower than car/plane",
        action: "Keep using trains",
        color: "green"
      });
    }

    if (currentValues.plane_km > 500) {
      newTips.push({
        id: "plane_high",
        category: "transport",
        icon: <Plane className="w-5 h-5" />,
        title: "✈️ High Air Travel",
        message: `${currentValues.plane_km} km flown. Consider virtual meetings or trains for short distances.`,
        impact: "Reduce by 50% with alternatives",
        action: "Use train for < 500 km",
        color: "red"
      });
    }

    if (currentValues.ac_hours > 8) {
      newTips.push({
        id: "ac_high",
        category: "electricity",
        icon: <Thermometer className="w-5 h-5" />,
        title: "❄️ High AC Usage",
        message: `${currentValues.ac_hours} hours of AC today. Set to 24°C and use fans.`,
        impact: "Save up to 30% on electricity",
        action: "Use timer and sleep mode",
        color: "red"
      });
    } else if (currentValues.ac_hours > 4) {
      newTips.push({
        id: "ac_moderate",
        category: "electricity",
        icon: <Thermometer className="w-5 h-5" />,
        title: "❄️ Moderate AC Usage",
        message: `${currentValues.ac_hours} hours of AC. Raise temperature by 2 degrees.`,
        impact: "Save 10-20% on electricity",
        action: "Clean filters regularly",
        color: "amber"
      });
    }

    if (currentValues.heater_hours > 4) {
      newTips.push({
        id: "heater_high",
        category: "electricity",
        icon: <Thermometer className="w-5 h-5" />,
        title: "🔥 High Heater Usage",
        message: `${currentValues.heater_hours} hours of heating. Wear warm clothes indoors.`,
        impact: "Reduce heating costs",
        action: "Lower thermostat by 2°C",
        color: "amber"
      });
    }

    if (currentValues.laptop_hours > 10) {
      newTips.push({
        id: "laptop_high",
        category: "electricity",
        icon: <Laptop className="w-5 h-5" />,
        title: "💻 High Laptop Usage",
        message: `${currentValues.laptop_hours} hours on laptop. Enable power saving mode.`,
        impact: "Save energy",
        action: "Unplug when fully charged",
        color: "blue"
      });
    }

    if (currentValues.tv_hours > 6) {
      newTips.push({
        id: "tv_high",
        category: "electricity",
        icon: <Tv className="w-5 h-5" />,
        title: "📺 High TV Usage",
        message: `${currentValues.tv_hours} hours of TV. Turn off when not watching.`,
        impact: "Reduce standby power",
        action: "Use a power strip",
        color: "blue"
      });
    }

    if (currentValues.food_waste_kg > 2) {
      newTips.push({
        id: "foodwaste_high",
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🍽️ High Food Waste",
        message: `${currentValues.food_waste_kg} kg of food waste today. Plan meals and compost.`,
        impact: "Reduce methane emissions",
        action: "Start a compost bin",
        color: "red"
      });
    } else if (currentValues.food_waste_kg > 0.5) {
      newTips.push({
        id: "foodwaste_moderate",
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🍽️ Moderate Food Waste",
        message: `${currentValues.food_waste_kg} kg wasted. Use leftovers creatively.`,
        impact: "Save money and emissions",
        action: "Make a shopping list",
        color: "amber"
      });
    }

    if (currentValues.plastic_waste_kg > 1) {
      newTips.push({
        id: "plastic_high",
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🥤 High Plastic Waste",
        message: `${currentValues.plastic_waste_kg} kg of plastic. Switch to reusable bottles and bags.`,
        impact: "Reduce ocean pollution",
        action: "Carry a reusable water bottle",
        color: "red"
      });
    }

    if (currentValues.paper_waste_kg > 1) {
      newTips.push({
        id: "paper_high",
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "📄 High Paper Waste",
        message: `${currentValues.paper_waste_kg} kg of paper. Go digital and recycle.`,
        impact: "Save trees",
        action: "Cancel paper bills",
        color: "amber"
      });
    }

    if (currentValues.chicken_servings > 3) {
      newTips.push({
        id: "chicken_high",
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🍗 High Chicken Consumption",
        message: `${currentValues.chicken_servings} chicken servings today. Try plant‑based alternatives.`,
        impact: "Reduce emissions by 50%",
        action: "Try tofu or legumes",
        color: "amber"
      });
    } else if (currentValues.chicken_servings > 0) {
      newTips.push({
        id: "chicken_moderate",
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🍗 Chicken in Moderation",
        message: `${currentValues.chicken_servings} chicken meals. Balance with veg options.`,
        impact: "Good step",
        action: "Add one meat‑free day",
        color: "blue"
      });
    }

    if (currentValues.fish_servings > 3) {
      newTips.push({
        id: "fish_high",
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🐟 High Fish Consumption",
        message: `${currentValues.fish_servings} fish servings. Choose sustainably sourced fish.`,
        impact: "Protect marine life",
        action: "Look for MSC label",
        color: "amber"
      });
    }

    if (currentValues.dairy_servings > 5) {
      newTips.push({
        id: "dairy_high",
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🥛 High Dairy Consumption",
        message: `${currentValues.dairy_servings} dairy servings. Try oat or almond milk.`,
        impact: "Lower carbon footprint",
        action: "Reduce cheese and yogurt",
        color: "amber"
      });
    }

    if (currentValues.vegetarian_meals > 2) {
      newTips.push({
        id: "veg_good",
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🌱 Great Vegetarian Choices",
        message: `${currentValues.vegetarian_meals} vegetarian meals today. Excellent for the planet!`,
        impact: "Lowest food emissions",
        action: "Share your recipes",
        color: "green"
      });
    }

    if (stats && stats.total > 0) {
      if (stats.transport > 30 && !newTips.some(t => t.category === "transport")) {
        newTips.push({
          id: "cat_transport",
          category: "transport",
          icon: <Car className="w-5 h-5" />,
          title: "🚗 High Transport Total",
          message: `Your total transport emissions today are ${stats.transport.toFixed(1)} kg. Consider carpooling or public transport.`,
          impact: "Could save up to 50%",
          action: "Combine trips",
          color: "purple"
        });
      }

      if (stats.electricity > 20 && !newTips.some(t => t.category === "electricity")) {
        newTips.push({
          id: "cat_electricity",
          category: "electricity",
          icon: <Zap className="w-5 h-5" />,
          title: "⚡ High Electricity Total",
          message: `Your electricity usage today is ${stats.electricity.toFixed(1)} kg. Use LED bulbs and reduce AC.`,
          impact: "Save up to 30%",
          action: "Set AC to 24°C",
          color: "red"
        });
      }

      if (stats.waste > 5 && !newTips.some(t => t.category === "waste")) {
        newTips.push({
          id: "cat_waste",
          category: "waste",
          icon: <Trash2 className="w-5 h-5" />,
          title: "🗑️ High Waste Total",
          message: `Your waste today is ${stats.waste.toFixed(1)} kg. Recycle and compost more.`,
          impact: "Reduce landfill",
          action: "Start composting",
          color: "red"
        });
      }

      if (stats.food > 15 && !newTips.some(t => t.category === "food")) {
        newTips.push({
          id: "cat_food",
          category: "food",
          icon: <Apple className="w-5 h-5" />,
          title: "🍔 High Food Total",
          message: `Your food emissions today are ${stats.food.toFixed(1)} kg. Try more plant‑based meals.`,
          impact: "Reduce by 50%",
          action: "Meat‑free days",
          color: "amber"
        });
      }

      if (stats.total > 100) {
        newTips.push({
          id: "general_high",
          category: "general",
          icon: <AlertTriangle className="w-5 h-5" />,
          title: "⚠️ High Overall Footprint",
          message: `Your total footprint today is ${stats.total.toFixed(1)} kg. Small changes add up!`,
          impact: "Pick one tip to start",
          action: "Review category tips",
          color: "red"
        });
      } else if (stats.total > 0 && stats.total < 30) {
        newTips.push({
          id: "general_low",
          category: "general",
          icon: <CheckCircle className="w-5 h-5" />,
          title: "🌟 Great Job!",
          message: `Your total footprint today is ${stats.total.toFixed(1)} kg. You're a climate champion!`,
          impact: "Keep it up!",
          action: "Inspire others",
          color: "green"
        });
      }
    }

    const filteredTips = selectedCategory === "all"
      ? newTips
      : newTips.filter(tip => tip.category === selectedCategory);

    setTips(filteredTips);
  };

  const categories = [
    { id: "all", label: "All Tips", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "transport", label: "Transport", icon: <Car className="w-4 h-4" /> },
    { id: "electricity", label: "Electricity", icon: <Zap className="w-4 h-4" /> },
    { id: "waste", label: "Waste", icon: <Trash2 className="w-4 h-4" /> },
    { id: "food", label: "Food", icon: <Apple className="w-4 h-4" /> }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      red: "bg-red-50 border-red-200 text-red-700",
      amber: "bg-amber-50 border-amber-200 text-amber-700",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
      cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-700"
    };
    return colors[color] || "bg-gray-50 border-gray-200 text-gray-700";
  };

  if (!tips.length) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border border-green-200">
        <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">No Tips Yet</h3>
        <p className="text-green-600">
          {stats === null || stats?.total === 0
            ? "No activities added for today. Add activities to get personalized tips!"
            : "Add more activities to get personalized tips!"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Smart Tips</h2>
        </div>
        <button
          onClick={generateTips}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh tips"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
              selectedCategory === cat.id
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {tips.map(tip => (
          <div
            key={tip.id}
            className={`p-4 rounded-xl border ${getColorClasses(tip.color)} transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/50 rounded-lg">{tip.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm mb-2">{tip.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full">💚 {tip.impact}</span>
                  <span className="text-xs font-medium">{tip.action}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Leaf className="w-3 h-3 text-green-500" />
          Small changes today add up to big impact tomorrow
          <Leaf className="w-3 h-3 text-green-500" />
        </p>
      </div>
    </div>
  );
}