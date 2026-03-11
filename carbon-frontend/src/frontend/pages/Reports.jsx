// src/frontend/pages/Reports.jsx
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Leaf,
  AlertCircle,
  Loader
} from "lucide-react";
import { activityAPI } from '../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month'); // week, month, year
  const [stats, setStats] = useState({
    totalEmissions: 0,
    totalActivities: 0,
    averagePerActivity: 0,
    categoryTotals: {},
    monthlyData: {}
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    loadReportData();
  }, [timeframe]);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats and activities
      const [statsRes, activitiesRes] = await Promise.all([
        activityAPI.getStats(),
        activityAPI.getAll()
      ]);
      
      const statsData = statsRes.data.data || {};
      const activitiesData = activitiesRes.data.data || [];
      
      setStats(statsData);
      setActivities(activitiesData);
      
      // Process monthly trend data
      const monthlyTrend = Object.entries(statsData.monthlyData || {}).map(([month, value]) => ({
        month,
        emissions: value
      }));
      setChartData(monthlyTrend);
      
      // Process category breakdown for pie chart
      const categories = [];
      Object.entries(statsData.categoryTotals || {}).forEach(([key, value]) => {
        if (value > 0) {
          categories.push({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: value
          });
        }
      });
      setCategoryData(categories);
      
    } catch (error) {
      console.error("Error loading reports:", error);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create export data
    const exportData = {
      summary: stats,
      activities: activities,
      exportDate: new Date().toISOString(),
      timeframe: timeframe
    };
    
    // Convert to JSON and download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `carbon-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load reports</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadReportData}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasData = activities.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">
              {hasData 
                ? "Track your carbon footprint trends and patterns"
                : "Start adding activities to see your reports"}
            </p>
          </div>
          
          {hasData && (
            <div className="flex gap-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last 12 months</option>
              </select>
              
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your first activity to start seeing detailed reports and analytics about your carbon footprint.
            </p>
            <button
              onClick={() => window.location.href = '/add'}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium"
            >
              Add Your First Activity
            </button>
          </div>
        ) : (
          /* Reports Content */
          <div className="space-y-8">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Total Emissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmissions?.toFixed(1)} kg</p>
                <p className="text-sm text-green-600 mt-2">CO₂ equivalent</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalActivities}</p>
                <p className="text-sm text-gray-600 mt-2">Tracked entries</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Average per Activity</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averagePerActivity?.toFixed(1)} kg</p>
                <p className="text-sm text-gray-600 mt-2">Per entry</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Carbon Intensity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(stats.totalEmissions / (stats.totalActivities || 1)).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 mt-2">kg/activity</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Trend Line Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Emission Trends</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="emissions" 
                        stroke="#059669" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        name="CO₂ (kg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Pie Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Emissions by Category</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Category Comparison */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Comparison</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#059669" name="CO₂ (kg)">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activities Table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categories</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Emissions</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.slice(0, 5).map(activity => (
                      <tr key={activity._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {activity.categories?.join(', ') || 'General'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {activity.totalEmissions?.toFixed(1)} kg
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => {/* View details */}}
                            className="text-green-600 hover:text-green-700"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}