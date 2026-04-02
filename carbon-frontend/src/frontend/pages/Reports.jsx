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
  Loader,
  FileJson,
  FileSpreadsheet,
  FileText,
  ChevronDown
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [showExportMenu, setShowExportMenu] = useState(false);
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
      
      // Process category breakdown
      const categories = [];
      const categoryTotals = statsData.categoryTotals || {};
      
      const categoryDisplayNames = {
        transport: "Transport",
        electricity: "Electricity",
        waste: "Waste",
        food: "Food"
      };
      
      Object.entries(categoryTotals).forEach(([key, value]) => {
        if (value > 0) {
          categories.push({
            name: categoryDisplayNames[key] || key.charAt(0).toUpperCase() + key.slice(1),
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

  // ========== JSON EXPORT ==========
  const exportJSON = () => {
    const exportData = {
      summary: stats,
      activities: activities,
      exportDate: new Date().toISOString(),
      timeframe: timeframe,
      reportType: 'JSON Export'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `carbon-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setShowExportMenu(false);
  };

  // ========== CSV EXPORT ==========
  const exportCSV = () => {
    // Prepare CSV data for activities
    const csvRows = [];
    
    // Headers
    const headers = ['Date', 'Categories', 'Total Emissions (kg CO₂)', 'Transport (kg)', 'Electricity (kg)', 'Waste (kg)', 'Food (kg)'];
    csvRows.push(headers.join(','));
    
    // Add activity rows
    activities.forEach(activity => {
      const row = [
        new Date(activity.date).toLocaleDateString(),
        `"${activity.categories?.map(cat => getCategoryDisplayName(cat)).join(', ') || 'General'}"`,
        activity.totalEmissions?.toFixed(2) || '0',
        activity.categoryTotals?.transport?.toFixed(2) || '0',
        activity.categoryTotals?.electricity?.toFixed(2) || '0',
        activity.categoryTotals?.waste?.toFixed(2) || '0',
        activity.categoryTotals?.food?.toFixed(2) || '0'
      ];
      csvRows.push(row.join(','));
    });
    
    // Add summary section
    csvRows.push(''); // Empty line
    csvRows.push('"SUMMARY STATISTICS"');
    csvRows.push(`"Total Emissions (kg CO₂)",${stats.totalEmissions?.toFixed(2) || 0}`);
    csvRows.push(`"Total Activities",${stats.totalActivities || 0}`);
    csvRows.push(`"Average per Activity (kg CO₂)",${stats.averagePerActivity?.toFixed(2) || 0}`);
    
    // Add category totals
    csvRows.push('"Category Breakdown"');
    Object.entries(stats.categoryTotals || {}).forEach(([category, value]) => {
      csvRows.push(`"${getCategoryDisplayName(category)}",${value?.toFixed(2) || 0}`);
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // ========== PDF EXPORT ==========
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(5, 150, 105); // Green color
    doc.text('CarbonWise - Carbon Footprint Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
    
    // Report info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    doc.text(`Timeframe: ${timeframe} view`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;
    
    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 14, yPos);
    yPos += 10;
    
    // Summary table
    const summaryData = [
      ['Total Emissions', `${stats.totalEmissions?.toFixed(2) || 0} kg CO₂`],
      ['Total Activities', `${stats.totalActivities || 0}`],
      ['Average per Activity', `${stats.averagePerActivity?.toFixed(2) || 0} kg CO₂`],
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255 },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Category Breakdown Section
    doc.setFontSize(16);
    doc.text('Category Breakdown', 14, yPos);
    yPos += 10;
    
    const categoryData_rows = Object.entries(stats.categoryTotals || {}).map(([category, value]) => [
      getCategoryDisplayName(category),
      `${value?.toFixed(2) || 0} kg CO₂`,
      `${stats.totalEmissions > 0 ? ((value / stats.totalEmissions) * 100).toFixed(1) : 0}%`
    ]);
    
    doc.autoTable({
      startY: yPos,
      head: [['Category', 'Emissions', 'Percentage']],
      body: categoryData_rows,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255 },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Recent Activities Section
    if (activities.length > 0) {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.text('Recent Activities', 14, yPos);
      yPos += 10;
      
      const activitiesData = activities.slice(0, 10).map(activity => [
        new Date(activity.date).toLocaleDateString(),
        activity.categories?.map(cat => getCategoryDisplayName(cat)).join(', ') || 'General',
        `${activity.totalEmissions?.toFixed(2) || 0} kg`
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Date', 'Categories', 'Emissions']],
        body: activitiesData,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105], textColor: 255 },
        margin: { left: 14, right: 14 }
      });
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} - CarbonWise Report`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Save PDF
    doc.save(`carbon-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportMenu(false);
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      transport: "Transport",
      electricity: "Electricity",
      waste: "Waste",
      food: "Food"
    };
    return names[category] || category;
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
              
              {/* Export Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showExportMenu && (
                  <>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={exportJSON}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FileJson className="w-4 h-4 text-blue-600" />
                        Export as JSON
                      </button>
                      <button
                        onClick={exportCSV}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        Export as CSV
                      </button>
                      <button
                        onClick={exportPDF}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                        Export as PDF
                      </button>
                    </div>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowExportMenu(false)}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {!hasData ? (
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
                          {activity.categories?.map(cat => getCategoryDisplayName(cat)).join(', ') || 'General'}
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