// src/frontend/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  Zap,
  Car,
  Utensils,
  ShoppingBag
} from "lucide-react";
import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('week');
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 890,
    totalActivities: 8450,
    totalEmissions: 45200,
    avgEmission: 5.35,
    reduction: 12.5
  });

  const recentActivities = [
    { user: "John Doe", action: "Added transport activity", emission: 12.5, time: "5 min ago" },
    { user: "Sarah Smith", action: "Updated electricity usage", emission: 8.2, time: "15 min ago" },
    { user: "Mike Johnson", action: "Added food purchases", emission: 3.7, time: "25 min ago" },
    { user: "Emily Brown", action: "Logged car travel", emission: 15.3, time: "45 min ago" },
    { user: "David Lee", action: "Added home energy", emission: 22.1, time: "1 hour ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              +12.5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,250</h3>
          <p className="text-gray-600 text-sm mt-1">Total Users</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-green-600 font-medium">↑ 48 new</span>
            <span className="text-xs text-gray-400">this week</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              +5.2%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">890</h3>
          <p className="text-gray-600 text-sm mt-1">Active Users</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-green-600 font-medium">↑ 32 active</span>
            <span className="text-xs text-gray-400">right now</span>
          </div>
        </div>

        {/* Total Activities */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              +18.3%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">8,450</h3>
          <p className="text-gray-600 text-sm mt-1">Total Activities</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-green-600 font-medium">↑ 234</span>
            <span className="text-xs text-gray-400">today</span>
          </div>
        </div>

        {/* Total Emissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              -8.2%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">45.2t</h3>
          <p className="text-gray-600 text-sm mt-1">CO₂ Emissions</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-green-600 font-medium">↓ 3.2t</span>
            <span className="text-xs text-gray-400">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emissions by Category */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Emissions by Category</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg">Month</button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Week</button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Year</button>
            </div>
          </div>
          <div className="h-80">
            <DonutPlaceholder
              centerLabel="45.2t"
              data={[
                { name: "Electricity", value: 18000 },
                { name: "Transport", value: 12000 },
                { name: "Food", value: 8500 },
                { name: "Purchases", value: 6700 }
              ]}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Electricity</p>
                  <p className="text-sm text-gray-600">18.0t CO₂</p>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-700">39.8%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <Car className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Transport</p>
                  <p className="text-sm text-gray-600">12.0t CO₂</p>
                </div>
              </div>
              <span className="text-sm font-medium text-purple-700">26.5%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Utensils className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Food</p>
                  <p className="text-sm text-gray-600">8.5t CO₂</p>
                </div>
              </div>
              <span className="text-sm font-medium text-amber-700">18.8%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-200 rounded-lg">
                  <ShoppingBag className="w-4 h-4 text-rose-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Purchases</p>
                  <p className="text-sm text-gray-600">6.7t CO₂</p>
                </div>
              </div>
              <span className="text-sm font-medium text-rose-700">14.9%</span>
            </div>
          </div>

          {/* Avg Emission Card */}
          <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 mb-1">Average per user</p>
            <p className="text-2xl font-bold text-green-900">5.35 kg</p>
            <p className="text-xs text-green-600 mt-1">↓ 12.5% from last month</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{activity.emission} kg</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 text-left bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg">
              <p className="font-semibold">Add Emission Factor</p>
              <p className="text-sm text-white/80 mt-1">Update carbon conversion rates</p>
            </button>
            
            <button className="w-full p-4 text-left bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200">
              <p className="font-semibold">Generate Report</p>
              <p className="text-sm text-blue-600 mt-1">Export analytics data</p>
            </button>
            
            <button className="w-full p-4 text-left bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200">
              <p className="font-semibold">Send Notification</p>
              <p className="text-sm text-purple-600 mt-1">Message all users</p>
            </button>
            
            <button className="w-full p-4 text-left bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200">
              <p className="font-semibold">Backup Data</p>
              <p className="text-sm text-amber-600 mt-1">Create system backup</p>
            </button>
          </div>

          {/* System Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">System Status</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Operational</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">API</span>
                <span className="text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Database</span>
                <span className="text-green-600">98.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Storage</span>
                <span className="text-amber-600">76% used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}