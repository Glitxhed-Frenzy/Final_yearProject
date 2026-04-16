// src/frontend/pages/Reports.jsx
import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Linkedin,
  X
} from "lucide-react";
import { activityAPI } from '../../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [stats, setStats] = useState({
    totalEmissions: 0,
    totalActivities: 0,
    averagePerActivity: 0,
    categoryTotals: {},
    monthlyData: {}
  });
  const [activities, setActivities] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const shareContainerRef = useRef(null);

  const socialPlatforms = [
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'bg-black', shareUrl: 'https://twitter.com/intent/tweet', getIntent: (text, url) => `?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-[#1877f2]', shareUrl: 'https://www.facebook.com/sharer/sharer.php', getIntent: (text, url) => `?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}` },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', shareUrl: 'https://www.instagram.com/', getIntent: (text, url) => `?text=${encodeURIComponent(text)}` },
    { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-[#25D366]', shareUrl: 'https://wa.me/', getIntent: (text, url) => `?text=${encodeURIComponent(text + ' ' + url)}` },
    { name: 'Reddit', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-[#FF4500]', shareUrl: 'https://www.reddit.com/submit', getIntent: (text, url) => `?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'bg-[#0077b5]', shareUrl: 'https://www.linkedin.com/sharing/share-offsite/', getIntent: (text, url) => `?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}` }
  ];

  useEffect(() => {
    loadUserData();
    loadReportData();
  }, [timeframe]);

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  };

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

  const viewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const closeModal = () => {
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  const captureChart = async (chartContainer) => {
    if (!chartContainer) return null;
    
    try {
      const svg = chartContainer.querySelector('svg');
      if (!svg) return null;
      
      const width = svg.clientWidth || 500;
      const height = svg.clientHeight || 300;
      
      const clonedSvg = svg.cloneNode(true);
      clonedSvg.setAttribute('width', width);
      clonedSvg.setAttribute('height', height);
      clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(clonedSvg);
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      });
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  const exportJSON = () => {
    const exportData = {
      user: user,
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

  const exportCSV = () => {
    const csvRows = [];
    
    csvRows.push('"USER INFORMATION"');
    csvRows.push(`"Name",${user?.name || 'N/A'}`);
    csvRows.push(`"Email",${user?.email || 'N/A'}`);
    csvRows.push(`"Phone",${user?.phone || 'N/A'}`);
    csvRows.push(`"Location",${user?.location || 'N/A'}`);
    csvRows.push(`"Member Since",${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}`);
    csvRows.push('');
    
    const headers = ['Date', 'Categories', 'Total Emissions (kg CO₂)', 'Transport (kg)', 'Electricity (kg)', 'Waste (kg)', 'Food (kg)'];
    csvRows.push(headers.join(','));
    
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
    
    csvRows.push('');
    csvRows.push('"SUMMARY STATISTICS"');
    csvRows.push(`"Total Emissions (kg CO₂)",${stats.totalEmissions?.toFixed(2) || 0}`);
    csvRows.push(`"Total Activities",${stats.totalActivities || 0}`);
    csvRows.push(`"Average per Activity (kg CO₂)",${stats.averagePerActivity?.toFixed(2) || 0}`);
    
    csvRows.push('"Category Breakdown"');
    Object.entries(stats.categoryTotals || {}).forEach(([category, value]) => {
      csvRows.push(`"${getCategoryDisplayName(category)}",${value?.toFixed(2) || 0}`);
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const generatePDF = async (forShare = false, platformName = null) => {
    const pieImage = await captureChart(pieChartRef.current);
    const barImage = await captureChart(barChartRef.current);
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    
    doc.setFontSize(24);
    doc.setTextColor(5, 150, 105);
    doc.text('CarbonWise', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Carbon Footprint Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text(`Timeframe: ${timeframe} view`, pageWidth / 2, yPos, { align: 'center' });
    if (forShare && platformName) {
      yPos += 5;
      doc.text(`Shared via ${platformName}`, pageWidth / 2, yPos, { align: 'center' });
    }
    yPos += 15;
    
    doc.setFillColor(240, 253, 244);
    doc.rect(14, yPos, pageWidth - 28, 45, 'F');
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(0.5);
    doc.rect(14, yPos, pageWidth - 28, 45, 'D');
    
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text('User Information', 20, yPos + 8);
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Name: ${user?.name || 'N/A'}`, 20, yPos + 18);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, yPos + 26);
    doc.text(`Phone: ${user?.phone || 'N/A'}`, 20, yPos + 34);
    
    doc.text(`Location: ${user?.location || 'N/A'}`, pageWidth / 2 + 10, yPos + 18);
    doc.text(`Member Since: ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}`, pageWidth / 2 + 10, yPos + 26);
    doc.text(`Total Activities: ${stats.totalActivities || 0}`, pageWidth / 2 + 10, yPos + 34);
    
    yPos += 55;
    
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(14, yPos, 85, 30, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Total CO₂', 20, yPos + 8);
    doc.setFontSize(16);
    doc.text(`${stats.totalEmissions?.toFixed(1) || 0} kg`, 20, yPos + 22);
    
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(103, yPos, 85, 30, 3, 3, 'F');
    doc.setFontSize(9);
    doc.text('Activities', 109, yPos + 8);
    doc.setFontSize(16);
    doc.text(`${stats.totalActivities || 0}`, 109, yPos + 22);
    
    yPos += 40;
    
    doc.setFillColor(52, 211, 153);
    doc.roundedRect(14, yPos, 85, 30, 3, 3, 'F');
    doc.setFontSize(9);
    doc.text('Avg per Activity', 20, yPos + 8);
    doc.setFontSize(16);
    doc.text(`${stats.averagePerActivity?.toFixed(1) || 0} kg`, 20, yPos + 22);
    
    doc.setFillColor(110, 231, 183);
    doc.roundedRect(103, yPos, 85, 30, 3, 3, 'F');
    doc.setFontSize(9);
    doc.text('Carbon Intensity', 109, yPos + 8);
    doc.setFontSize(16);
    doc.text(`${(stats.totalEmissions / (stats.totalActivities || 1)).toFixed(1)} kg/act`, 109, yPos + 22);
    
    yPos += 50;
    doc.setTextColor(0, 0, 0);
    
    if (pieImage && categoryData.length > 0) {
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Emissions by Category', 14, yPos);
      yPos += 5;
      
      doc.addImage(pieImage, 'PNG', 14, yPos, 90, 70);
      
      let legendY = yPos + 10;
      categoryData.forEach((category, index) => {
        const hexColor = COLORS[index % COLORS.length];
        const rgb = hexColor.replace('#', '').match(/.{2}/g).map(c => parseInt(c, 16));
        doc.setFillColor(rgb[0], rgb[1], rgb[2]);
        doc.rect(pageWidth - 50, legendY, 5, 5, 'F');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${category.name}: ${category.value.toFixed(1)} kg (${((category.value / stats.totalEmissions) * 100).toFixed(1)}%)`, pageWidth - 43, legendY + 4);
        legendY += 6;
      });
      
      yPos += 85;
    }
    
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Category Breakdown', 14, yPos);
    yPos += 10;
    
    const categoryTableData = Object.entries(stats.categoryTotals || {}).map(([category, value]) => [
      getCategoryDisplayName(category),
      `${value?.toFixed(2) || 0} kg CO₂`,
      `${stats.totalEmissions > 0 ? ((value / stats.totalEmissions) * 100).toFixed(1) : 0}%`
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Emissions', 'Percentage']],
      body: categoryTableData,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (barImage && categoryData.length > 0) {
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Category Comparison', 14, yPos);
      yPos += 5;
      doc.addImage(barImage, 'PNG', 14, yPos, 180, 70);
      yPos += 85;
    }
    
    if (activities.length > 0) {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Recent Activities', 14, yPos);
      yPos += 10;
      
      const activitiesData = activities.slice(0, 10).map(activity => [
        new Date(activity.date).toLocaleDateString(),
        activity.categories?.map(cat => getCategoryDisplayName(cat)).join(', ') || 'General',
        `${activity.totalEmissions?.toFixed(2) || 0} kg`
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Categories', 'Emissions']],
        body: activitiesData,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 }
      });
    }
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} - CarbonWise Report | ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    return doc;
  };

  const exportPDF = async () => {
    const loadingToast = document.createElement('div');
    loadingToast.innerHTML = '📄 Generating PDF with your data...';
    loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(loadingToast);
    
    try {
      const doc = await generatePDF(false, null);
      doc.save(`carbon-report-${user?.name?.replace(/\s/g, '_') || 'user'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Error: ' + error.message);
    } finally {
      document.body.removeChild(loadingToast);
      setShowExportMenu(false);
    }
  };

  const shareOnSocialMedia = async (platform) => {
    setSharing(true);
    setShowShareMenu(false);
    
    const loadingToast = document.createElement('div');
    loadingToast.innerHTML = `📸 Preparing share image for ${platform.name}...`;
    loadingToast.className = 'fixed top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(loadingToast);
    
    try {
      if (shareContainerRef.current) {
        const container = shareContainerRef.current;
        container.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 100));
        const imageDataUrl = await toPng(container, { quality: 0.95, backgroundColor: '#ffffff' });
        container.style.display = 'none';
        
        const blob = await (await fetch(imageDataUrl)).blob();
        const imageFile = new File([blob], 'carbon-stats.png', { type: 'image/png' });
        
        const shareMessage = `🌍 My carbon footprint report: ${stats.totalEmissions?.toFixed(1) || 0} kg CO₂ from ${stats.totalActivities || 0} activities! Track yours with CarbonWise 🌿`;
        
        if (platform.name === 'WhatsApp' && navigator.share) {
          try {
            await navigator.share({
              title: 'My Carbon Footprint Report',
              text: shareMessage,
              files: [imageFile]
            });
          } catch (err) {
            window.open(`${platform.shareUrl}${platform.getIntent(shareMessage, window.location.href)}`, '_blank');
            const link = document.createElement('a');
            link.download = 'carbon-stats.png';
            link.href = imageDataUrl;
            link.click();
          }
        } 
        else if (platform.name !== 'Instagram') {
          const link = document.createElement('a');
          link.download = 'carbon-stats.png';
          link.href = imageDataUrl;
          link.click();
          window.open(`${platform.shareUrl}${platform.getIntent(shareMessage, window.location.href)}`, '_blank', 'width=600,height=400');
          alert(`📸 Your carbon stats image has been downloaded. You can attach it to your ${platform.name} post.`);
        } 
        else if (platform.name === 'Instagram') {
          const link = document.createElement('a');
          link.download = 'carbon-stats.png';
          link.href = imageDataUrl;
          link.click();
          alert(`📸 To share on Instagram:\n\n1. Your carbon stats image has been downloaded\n2. Open Instagram and share it with this caption:\n\n"${shareMessage}"\n\n#CarbonWise #CarbonFootprint #SustainableLiving`);
        }
      } else {
        throw new Error('Share container not found');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to generate shareable image. Please try again.');
    } finally {
      document.body.removeChild(loadingToast);
      setSharing(false);
    }
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
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  disabled={sharing}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showShareMenu && (
                  <>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 overflow-hidden">
                      {socialPlatforms.map((platform) => (
                        <button
                          key={platform.name}
                          onClick={() => shareOnSocialMedia(platform)}
                          className={`w-full px-4 py-2.5 text-left text-white hover:opacity-90 transition-all flex items-center gap-3 ${platform.color}`}
                        >
                          {platform.icon}
                          <span className="text-sm font-medium">Share on {platform.name}</span>
                        </button>
                      ))}
                    </div>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowShareMenu(false)}
                    />
                  </>
                )}
              </div>
              
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
                        Export as PDF (with charts)
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

        <div ref={shareContainerRef} style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '800px', background: 'white', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '28px', color: '#059669', margin: 0 }}>CarbonWise</h1>
            <h2 style={{ fontSize: '20px', margin: '5px 0' }}>Carbon Footprint Report</h2>
            <p style={{ fontSize: '12px', color: '#666' }}>Generated: {new Date().toLocaleString()} | Timeframe: {timeframe} view</p>
          </div>
          
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #059669' }}>
            <h3 style={{ fontSize: '16px', color: '#059669', marginBottom: '8px' }}>User Information</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px' }}>
              <div><strong>Name:</strong> {user?.name || 'N/A'}</div>
              <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
              <div><strong>Phone:</strong> {user?.phone || 'N/A'}</div>
              <div><strong>Location:</strong> {user?.location || 'N/A'}</div>
              <div><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Total Activities:</strong> {stats.totalActivities || 0}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: '#059669', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px' }}>Total CO₂</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalEmissions?.toFixed(1) || 0} kg</div>
            </div>
            <div style={{ flex: 1, background: '#10b981', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px' }}>Activities</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalActivities || 0}</div>
            </div>
            <div style={{ flex: 1, background: '#34d399', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px' }}>Avg per Activity</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.averagePerActivity?.toFixed(1) || 0} kg</div>
            </div>
            <div style={{ flex: 1, background: '#6ee7b7', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px' }}>Carbon Intensity</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{(stats.totalEmissions / (stats.totalActivities || 1)).toFixed(1)} kg/act</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Emissions by Category</h3>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
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
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', textAlign: 'center' }}>Category Comparison</h3>
              <div style={{ width: '100%', height: '250px' }}>
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
          
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginTop: '16px' }}>
            CarbonWise – Track. Reduce. Make a Difference.
          </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Emissions by Category</h2>
                <div className="h-80" ref={pieChartRef}>
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

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Comparison</h2>
                <div className="h-80" ref={barChartRef}>
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
                            onClick={() => viewActivityDetails(activity)}
                            className="text-green-600 hover:text-green-700 font-medium"
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

        {showActivityModal && selectedActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedActivity.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Emissions</p>
                    <p className="font-medium text-green-600">{selectedActivity.totalEmissions} kg CO₂</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Categories</p>
                    <div className="flex gap-2 mt-1">
                      {selectedActivity.categories?.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-gray-100 rounded-lg text-sm capitalize">
                          {getCategoryDisplayName(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Activity Breakdown</p>
                  <div className="space-y-2">
                    {selectedActivity.answers && Object.entries(selectedActivity.answers).map(([key, value]) => {
                      if (key === 'car_selected' || key === 'train_selected') return null;
                      let displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      if (key === 'car_km') displayKey = 'Car (km)';
                      if (key === 'bus_km') displayKey = 'Bus (km)';
                      if (key === 'train_km') displayKey = 'Train (km)';
                      if (key === 'plane_km') displayKey = 'Plane (km)';
                      if (key === 'ac_hours') displayKey = 'AC (hours)';
                      if (key === 'heater_hours') displayKey = 'Heater (hours)';
                      if (key === 'laptop_hours') displayKey = 'Laptop (hours)';
                      if (key === 'tv_hours') displayKey = 'TV (hours)';
                      if (key === 'food_waste_kg') displayKey = 'Food Waste (kg)';
                      if (key === 'plastic_waste_kg') displayKey = 'Plastic Waste (kg)';
                      if (key === 'paper_waste_kg') displayKey = 'Paper Waste (kg)';
                      if (key === 'chicken_servings') displayKey = 'Chicken (servings)';
                      if (key === 'dairy_servings') displayKey = 'Dairy (servings)';
                      if (key === 'vegetarian_meals') displayKey = 'Vegetarian Meals';
                      if (key === 'car_type') displayKey = 'Car Type';
                      if (key === 'car_fuel') displayKey = 'Fuel Type';
                      if (key === 'train_type') displayKey = 'Train Type';
                      
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{displayKey}</span>
                          <span className="font-medium">
                            {value.value !== undefined ? `${value.value} ${value.unit || ''}` : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <button onClick={closeModal} className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}