// src/frontend/components/CarbonTips.jsx
import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Car, 
  Zap, 
  Laptop, 
  Trash2,
  Apple,
  RefreshCw,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Thermometer,
  Tv,
  Bus,
  Train,
  Plane
} from "lucide-react";

export default function CarbonTips({ stats, activities }) {
  const [tips, setTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (stats) {
      generateTips();
    }
  }, [stats, selectedCategory]);

  const generateTips = () => {
    const newTips = [];
    
    // Skip if no data
    if (!stats.total) {
      setTips([]);
      return;
    }
    
    // ========== TRANSPORT TIPS ==========
    if (stats.transport > 100) {
      newTips.push({
        id: 1,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚗 High Transport Emissions",
        message: `Your transport emissions (${stats.transport.toFixed(1)} kg) are higher than average. Consider carpooling or using public transport.`,
        impact: "Could save up to 50% on transport emissions",
        action: "Try carpooling twice a week",
        color: "purple"
      });
    } else if (stats.transport > 50) {
      newTips.push({
        id: 2,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚌 Moderate Transport",
        message: "You're doing okay! Try combining trips or walking for short distances.",
        impact: "Save 10-20% on fuel costs",
        action: "Walk for trips under 1 km",
        color: "blue"
      });
    } else if (stats.transport > 0) {
      newTips.push({
        id: 3,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚲 Low Transport",
        message: "Great job! You're keeping transport emissions low. Keep it up!",
        impact: "You're an eco-friendly traveler!",
        action: "Share your tips with friends",
        color: "green"
      });
    }

    // ========== ELECTRICITY TIPS ==========
    if (stats.electricity > 500) {
      newTips.push({
        id: 4,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "⚡ High Electricity Usage",
        message: `Your electricity usage (${stats.electricity.toFixed(1)} kg) is high. Consider LED bulbs and better insulation.`,
        impact: "Save up to 30% on electricity bills",
        action: "Switch to LED bulbs today",
        color: "red"
      });
    } else if (stats.electricity > 200) {
      newTips.push({
        id: 5,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "💡 Moderate Electricity",
        message: "Try setting your AC 2 degrees higher and unplug devices when not in use.",
        impact: "Save 10-20% on electricity",
        action: "Unplug idle electronics",
        color: "amber"
      });
    } else if (stats.electricity > 0) {
      newTips.push({
        id: 6,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "🌟 Good Electricity Usage",
        message: "You're doing well with electricity consumption! Keep using energy-efficient practices.",
        impact: "You're saving money and the planet!",
        action: "Maintain your habits",
        color: "green"
      });
    }

    // ========== WASTE TIPS ==========
    if (stats.waste > 50) {
      newTips.push({
        id: 7,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🗑️ High Waste Generation",
        message: `Your waste generation (${stats.waste.toFixed(1)} kg) is high. Start recycling and composting.`,
        impact: "Reduce landfill waste by 50%",
        action: "Start composting food waste",
        color: "red"
      });
    } else if (stats.waste > 20) {
      newTips.push({
        id: 8,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "♻️ Moderate Waste",
        message: "You're generating moderate waste. Try reducing single-use plastics and recycling more.",
        impact: "Lower your carbon footprint",
        action: "Use reusable bags and bottles",
        color: "amber"
      });
    } else if (stats.waste > 0) {
      newTips.push({
        id: 9,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🌟 Good Waste Management",
        message: "You're keeping waste low! Consider aiming for zero waste.",
        impact: "You're helping reduce landfill emissions",
        action: "Share your waste reduction tips",
        color: "green"
      });
    }

    // ========== FOOD TIPS ==========
    if (stats.food > 100) {
      newTips.push({
        id: 10,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🍔 High Food Emissions",
        message: `Your food emissions (${stats.food.toFixed(1)} kg) are high. Try incorporating more plant-based meals.`,
        impact: "Reduce food emissions by 50%",
        action: "Try 2 meat-free days per week",
        color: "amber"
      });
    } else if (stats.food > 50) {
      newTips.push({
        id: 11,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🥗 Moderate Food Impact",
        message: "You're doing okay! Buy local and seasonal produce to reduce your food footprint.",
        impact: "Support local farmers",
        action: "Visit farmers market",
        color: "blue"
      });
    } else if (stats.food > 0) {
      newTips.push({
        id: 12,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🌱 Low Food Emissions",
        message: "Great job! Your food choices are environmentally friendly.",
        impact: "You're making a difference!",
        action: "Keep it up!",
        color: "green"
      });
    }

    // ========== GENERAL TIPS ==========
    if (stats.total > 1000) {
      newTips.push({
        id: 13,
        category: "general",
        icon: <AlertTriangle className="w-5 h-5" />,
        title: "⚠️ High Overall Footprint",
        message: "Your total footprint is above average. Small changes add up!",
        impact: "Pick one tip to start",
        action: "Review category tips",
        color: "red"
      });
    } else if (stats.total > 0 && stats.total < 500) {
      newTips.push({
        id: 14,
        category: "general",
        icon: <CheckCircle className="w-5 h-5" />,
        title: "🌟 Great Job!",
        message: "You're keeping your carbon footprint low!",
        impact: "You're making a difference!",
        action: "Keep it up!",
        color: "green"
      });
    }

    // Add specific category tips based on highest contributor
    const categories = [
      { name: "transport", value: stats.transport, label: "Transport", icon: <Car className="w-4 h-4" /> },
      { name: "electricity", value: stats.electricity, label: "Electricity", icon: <Zap className="w-4 h-4" /> },
      { name: "waste", value: stats.waste, label: "Waste", icon: <Trash2 className="w-4 h-4" /> },
      { name: "food", value: stats.food, label: "Food", icon: <Apple className="w-4 h-4" /> }
    ];
    
    const highestCategory = categories.reduce((max, cat) => 
      (cat.value > max.value) ? cat : max, { value: 0 });

    if (highestCategory.value > 0 && highestCategory.name !== "general") {
      // Add a specific tip for the highest category if not already added
      const alreadyHasTip = newTips.some(tip => tip.category === highestCategory.name);
      if (!alreadyHasTip) {
        let tipMessage = "";
        let tipAction = "";
        let tipColor = "";
        
        switch(highestCategory.name) {
          case "transport":
            tipMessage = "Your highest impact is from transport. Consider switching to public transport or carpooling.";
            tipAction = "Try carpooling once a week";
            tipColor = "purple";
            break;
          case "electricity":
            tipMessage = "Your highest impact is from electricity. Unplug devices when not in use.";
            tipAction = "Switch to energy-efficient appliances";
            tipColor = "blue";
            break;
          case "waste":
            tipMessage = "Your highest impact is from waste. Start recycling and composting.";
            tipAction = "Start a compost bin";
            tipColor = "emerald";
            break;
          case "food":
            tipMessage = "Your highest impact is from food. Try reducing meat consumption.";
            tipAction = "Try one meat-free day per week";
            tipColor = "amber";
            break;
        }
        
        newTips.push({
          id: 15,
          category: highestCategory.name,
          icon: highestCategory.icon,
          title: `🎯 Focus on ${highestCategory.label}`,
          message: tipMessage,
          impact: "Target your biggest impact area",
          action: tipAction,
          color: tipColor
        });
      }
    }

    // Filter by selected category
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
          Add more activities to get personalized tips!
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
              <div className="p-2 bg-white/50 rounded-lg">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm mb-2">{tip.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full">
                    💚 {tip.impact}
                  </span>
                  <span className="text-xs font-medium">
                    {tip.action}
                  </span>
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
          Small changes add up to big impact
          <Leaf className="w-3 h-3 text-green-500" />
        </p>
      </div>
    </div>
  );
}