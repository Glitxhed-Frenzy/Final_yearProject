// src/frontend/admin/AdminStats.jsx
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Users,
  Activity,
  Target,
  Award
} from "lucide-react";
import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminStats() {
  const [dateRange, setDateRange] = useState('month');

  const stats = [
    {
      title: "User Growth",
      value: "+23.5%",
      change: "+12.3%",
      trend: "up",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Activity Rate",
      value: "78.2%",
      change: "+5.4%",
      trend: "up",
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: "Avg. Reduction",
      value: "12.5%",
      change: "+2.3%",
      trend: "up",
      icon: <Target className="w-5 h-5" />
    },
    {
      title: "Top Performers",
      value: "1,234",
      change: "+8.7%",
      trend: "up",
      icon: <Award className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
            <option value="year">Last 12 months</option>
          </select>
          <button className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emissions Distribution</h2>
          <div className="h-80">
            <DonutPlaceholder
              centerLabel="45.2t"
              data={[
                { name: "Electricity", value: 60 },
                { name: "Transport", value: 25 },
                { name: "Food", value: 10 },
                { name: "Other", value: 5 }
              ]}
            />
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Electricity</span>
                <span className="text-sm text-gray-600">18,000 kg (39.8%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '39.8%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Transport</span>
                <span className="text-sm text-gray-600">12,000 kg (26.5%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '26.5%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Food</span>
                <span className="text-sm text-gray-600">8,500 kg (18.8%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18.8%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Purchases</span>
                <span className="text-sm text-gray-600">6,700 kg (14.9%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '14.9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold mb-1">890</p>
          <p className="text-green-100 text-sm">↑ 12% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Avg. Daily Activity</h3>
          <p className="text-3xl font-bold mb-1">124</p>
          <p className="text-blue-100 text-sm">↑ 8% from last week</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Reduction Goal</h3>
          <p className="text-3xl font-bold mb-1">78%</p>
          <p className="text-purple-100 text-sm">On track to meet target</p>
        </div>
      </div>
    </div>
  );
}