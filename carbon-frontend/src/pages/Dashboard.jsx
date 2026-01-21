import MetricCard from "../components/MetricCard";
import ActivityCard from "../components/ActivityCard";
import DonutPlaceholder from "../components/DonutPlaceholder";
import { TrendingDown, TrendingUp, Plus, Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex! 👋</h1>
        <p className="text-gray-600 mt-2">Track and reduce your carbon footprint</p>
      </div>

      {/* Time filter */}
      <div className="flex justify-between items-center mb-8">
        <div className="inline-flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
          {['Today', 'Week', 'Month', 'Year'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === 'Month'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard 
          title="Total CO₂ Emissions" 
          value="1,240 kg" 
          highlight={true}
          trend="down"
          trendValue={12.5}
          icon="🌍"
        />
        <MetricCard 
          title="Electricity" 
          value="520 kg" 
          subtitle="85 kWh used"
          icon="⚡"
          color="blue"
        />
        <MetricCard 
          title="Transport" 
          value="430 kg" 
          subtitle="320 km traveled"
          icon="🚗"
          color="purple"
        />
        <MetricCard 
          title="Food & Purchases" 
          value="290 kg" 
          subtitle="Sustainable choices"
          icon="🍎"
          color="orange"
        />
      </div>

      {/* Charts and Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Emissions Breakdown</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Jan 2025</span>
              </div>
            </div>
            <div className="h-80">
              <DonutPlaceholder
                centerLabel="This Month"
                data={[
                  { name: "Electricity", value: 520, color: "#3b82f6" },
                  { name: "Transport", value: 430, color: "#8b5cf6" },
                  { name: "Food", value: 210, color: "#f59e0b" },
                  { name: "Purchases", value: 80, color: "#ef4444" },
                ]}
              />
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electricity', 'Transport', 'Food', 'Purchases'].map((category, idx) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {[520, 430, 210, 80][idx]} kg
                  </div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <span className="text-sm text-green-600 font-medium">View All →</span>
          </div>
          
          <div className="space-y-4">
            <ActivityCard 
              title="Electricity Usage" 
              category="Home" 
              date="Today, 10:30 AM" 
              emission="110" 
              icon="⚡"
            />
            <ActivityCard 
              title="Car Travel" 
              category="Commute" 
              date="Yesterday, 8:15 AM" 
              emission="45" 
              icon="🚗"
            />
            <ActivityCard 
              title="Grocery Shopping" 
              category="Food" 
              date="Jan 22, 2025" 
              emission="28" 
              icon="🛒"
            />
            <ActivityCard 
              title="Flight to Delhi" 
              category="Travel" 
              date="Jan 20, 2025" 
              emission="320" 
              icon="✈️"
            />
          </div>

          {/* Insights Card */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">🌱 Weekly Insight</h3>
            <p className="text-sm text-blue-800">
              You've reduced your carbon footprint by <span className="font-bold">12.5%</span> compared to last week. Keep it up!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}