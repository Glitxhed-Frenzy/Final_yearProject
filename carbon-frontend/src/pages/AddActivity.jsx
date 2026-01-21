import { useState } from "react";
import { Zap, Car, Utensils, ShoppingBag, Calculator } from "lucide-react";

const categories = [
  { id: 1, name: "Electricity", icon: <Zap className="w-5 h-5" />, unit: "kWh", color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Transport", icon: <Car className="w-5 h-5" />, unit: "km", color: "from-purple-500 to-violet-500" },
  { id: 3, name: "Food", icon: <Utensils className="w-5 h-5" />, unit: "kg", color: "from-amber-500 to-orange-500" },
  { id: 4, name: "Purchases", icon: <ShoppingBag className="w-5 h-5" />, unit: "items", color: "from-rose-500 to-pink-500" },
];

export default function AddActivity() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  const calculateEmissions = () => {
    if (!amount) return "0";
    const value = parseFloat(amount);
    const factors = { 1: 0.85, 2: 0.12, 3: 2.5, 4: 10 };
    return (value * factors[selectedCategory]).toFixed(2);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Activity</h1>
        <p className="text-gray-600 mt-2">Track your carbon footprint by logging daily activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Category Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                      selectedCategory === category.id
                        ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-md`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({currentCategory?.unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder={`Enter ${currentCategory?.unit} value`}
                    step="0.01"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Calculator className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Add a note about this activity..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <button className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg text-lg">
                Save Activity
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Calculation */}
        <div className="space-y-6">
          {/* Emission Calculation */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Emission Calculation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Activity</span>
                <span className="font-medium">{currentCategory?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount</span>
                <span className="font-medium">{amount || "0"} {currentCategory?.unit}</span>
              </div>
              <div className="border-t border-green-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Estimated Emissions</span>
                  <span className="text-2xl font-bold text-green-700">{calculateEmissions()} kg CO₂</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on standard emission factors for {currentCategory?.name.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips to Reduce</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Use LED bulbs to save 80% energy</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Carpool twice a week reduces emissions by 40%</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span>Plant-based meals have lower carbon footprint</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Activities this month</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total emissions saved</span>
                <span className="font-semibold text-green-600">-156 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Carbon footprint score</span>
                <span className="font-semibold">B+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}