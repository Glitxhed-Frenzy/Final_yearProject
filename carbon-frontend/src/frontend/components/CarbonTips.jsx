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
    if (stats && stats.total && stats.total > 0) {
      generateTips();
    } else {
      setTips([]);
    }
  }, [stats, selectedCategory]);

  const generateTips = () => {
    const newTips = [];
    
    if (!stats.total || stats.total === 0) {
      setTips([]);
      return;
    }
    
    if (stats.transport > 30) {
      newTips.push({
        id: 1,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚗 High Transport Emissions",
        message: `Your transport emissions today (${stats.transport.toFixed(1)} kg) are high. Consider carpooling or using public transport.`,
        impact: "Could save up to 50% on transport emissions",
        action: "Try carpooling twice a week",
        color: "purple"
      });
    } else if (stats.transport > 15) {
      newTips.push({
        id: 2,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚌 Moderate Transport",
        message: "Your transport emissions today are moderate. Try combining trips or walking for short distances.",
        impact: "Save 10-20% on fuel costs",
        action: "Walk for trips under 1 km",
        color: "blue"
      });
    } else if (stats.transport > 0 && stats.transport <= 15) {
      newTips.push({
        id: 3,
        category: "transport",
        icon: <Car className="w-5 h-5" />,
        title: "🚲 Low Transport",
        message: "Great job! You're keeping transport emissions low today. Keep it up!",
        impact: "You're an eco-friendly traveler today!",
        action: "Share your tips with friends",
        color: "green"
      });
    }

    if (stats.electricity > 20) {
      newTips.push({
        id: 4,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "⚡ High Electricity Usage",
        message: `Your electricity usage today (${stats.electricity.toFixed(1)} kg) is high. Consider LED bulbs and reducing AC usage.`,
        impact: "Save up to 30% on electricity bills",
        action: "Set AC to 24°C and use fans",
        color: "red"
      });
    } else if (stats.electricity > 10) {
      newTips.push({
        id: 5,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "💡 Moderate Electricity",
        message: "Your electricity usage today is moderate. Try setting your AC 2 degrees higher and unplug devices when not in use.",
        impact: "Save 10-20% on electricity",
        action: "Unplug idle electronics",
        color: "amber"
      });
    } else if (stats.electricity > 0 && stats.electricity <= 10) {
      newTips.push({
        id: 6,
        category: "electricity",
        icon: <Zap className="w-5 h-5" />,
        title: "🌟 Good Electricity Usage",
        message: "You're doing well with electricity consumption today! Keep using energy-efficient practices.",
        impact: "You're saving money and the planet today!",
        action: "Maintain your habits",
        color: "green"
      });
    }

    if (stats.waste > 5) {
      newTips.push({
        id: 7,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🗑️ High Waste Generation",
        message: `Your waste generation today (${stats.waste.toFixed(1)} kg) is high. Start recycling and composting.`,
        impact: "Reduce landfill waste by 50%",
        action: "Start composting food waste",
        color: "red"
      });
    } else if (stats.waste > 2) {
      newTips.push({
        id: 8,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "♻️ Moderate Waste",
        message: "You're generating moderate waste today. Try reducing single-use plastics and recycling more.",
        impact: "Lower your carbon footprint",
        action: "Use reusable bags and bottles",
        color: "amber"
      });
    } else if (stats.waste > 0 && stats.waste <= 2) {
      newTips.push({
        id: 9,
        category: "waste",
        icon: <Trash2 className="w-5 h-5" />,
        title: "🌟 Good Waste Management",
        message: "You're keeping waste low today! Consider aiming for zero waste.",
        impact: "You're helping reduce landfill emissions today!",
        action: "Share your waste reduction tips",
        color: "green"
      });
    }

    if (stats.food > 15) {
      newTips.push({
        id: 10,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🍔 High Food Emissions",
        message: `Your food emissions today (${stats.food.toFixed(1)} kg) are high. Try incorporating more plant-based meals.`,
        impact: "Reduce food emissions by 50%",
        action: "Try 2 meat-free days per week",
        color: "amber"
      });
    } else if (stats.food > 5) {
      newTips.push({
        id: 11,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🥗 Moderate Food Impact",
        message: "Your food impact today is moderate. Buy local and seasonal produce to reduce your food footprint.",
        impact: "Support local farmers",
        action: "Visit farmers market",
        color: "blue"
      });
    } else if (stats.food > 0 && stats.food <= 5) {
      newTips.push({
        id: 12,
        category: "food",
        icon: <Apple className="w-5 h-5" />,
        title: "🌱 Low Food Emissions",
        message: "Great job! Your food choices today are environmentally friendly.",
        impact: "You're making a difference today!",
        action: "Keep it up!",
        color: "green"
      });
    }

    if (stats.total > 100) {
      newTips.push({
        id: 13,
        category: "general",
        icon: <AlertTriangle className="w-5 h-5" />,
        title: "⚠️ High Overall Footprint",
        message: `Your total footprint today (${stats.total.toFixed(1)} kg) is above average. Small changes add up!`,
        impact: "Pick one tip to start",
        action: "Review category tips",
        color: "red"
      });
    } else if (stats.total > 0 && stats.total < 30) {
      newTips.push({
        id: 14,
        category: "general",
        icon: <CheckCircle className="w-5 h-5" />,
        title: "🌟 Great Job!",
        message: `Your total footprint today (${stats.total.toFixed(1)} kg) is low. You're making a real difference!`,
        impact: "You're a climate champion today!",
        action: "Keep it up!",
        color: "green"
      });
    }

    const categories = [
      { name: "transport", value: stats.transport, label: "Transport", icon: <Car className="w-4 h-4" /> },
      { name: "electricity", value: stats.electricity, label: "Electricity", icon: <Zap className="w-4 h-4" /> },
      { name: "waste", value: stats.waste, label: "Waste", icon: <Trash2 className="w-4 h-4" /> },
      { name: "food", value: stats.food, label: "Food", icon: <Apple className="w-4 h-4" /> }
    ];
    
    const highestCategory = categories.reduce((max, cat) => 
      (cat.value > max.value) ? cat : max, { value: 0 });

    if (highestCategory.value > 0 && highestCategory.name !== "general") {
      const alreadyHasTip = newTips.some(tip => tip.category === highestCategory.name);
      if (!alreadyHasTip) {
        let tipMessage = "";
        let tipAction = "";
        let tipColor = "";
        
        switch(highestCategory.name) {
          case "transport":
            tipMessage = "Your highest impact today is from transport. Consider switching to public transport or carpooling.";
            tipAction = "Try carpooling once a week";
            tipColor = "purple";
            break;
          case "electricity":
            tipMessage = "Your highest impact today is from electricity. Unplug devices when not in use.";
            tipAction = "Switch to energy-efficient appliances";
            tipColor = "blue";
            break;
          case "waste":
            tipMessage = "Your highest impact today is from waste. Start recycling and composting.";
            tipAction = "Start a compost bin";
            tipColor = "emerald";
            break;
          case "food":
            tipMessage = "Your highest impact today is from food. Try reducing meat consumption.";
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
          impact: "Target your biggest impact area today",
          action: tipAction,
          color: tipColor
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
          Small changes today add up to big impact tomorrow
          <Leaf className="w-3 h-3 text-green-500" />
        </p>
      </div>
    </div>
  );
}