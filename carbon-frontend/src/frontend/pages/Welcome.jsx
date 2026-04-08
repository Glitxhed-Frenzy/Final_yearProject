// src/frontend/pages/Welcome.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Globe, 
  TrendingDown,
  Sparkles,
  ChevronRight,
  Target,
  Heart,
  Shield,
  Zap,
  Home,
  Car,
  Apple,
  Trash2,
  Laptop,
  Award,
  Clock,
  Coins,
  TreePine,
  Wind,
  Sun,
  Calendar,
  Download,
  Share2,
  Activity,
  Lightbulb
} from "lucide-react";

export default function Welcome() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Actual categories that match the app
  const categories = [
    { icon: <Car className="w-6 h-6" />, name: "Transport", color: "purple", desc: "Track car, bus, train & plane emissions with real-time calculation" },
    { icon: <Zap className="w-6 h-6" />, name: "Electricity", color: "blue", desc: "Monitor AC, heater, laptop & TV electricity consumption" },
    { icon: <Trash2 className="w-6 h-6" />, name: "Waste", color: "emerald", desc: "Track food, plastic, paper, metal & e-waste with recycling rates" },
    { icon: <Apple className="w-6 h-6" />, name: "Food", color: "amber", desc: "Log chicken, fish, dairy & vegetarian meals" }
  ];

  // Impact stats
  const impacts = [
    { icon: <TreePine className="w-8 h-8" />, title: "CO₂ Tracked", value: "125+ tons", desc: "Collectively monitored by our community" },
    { icon: <Wind className="w-8 h-8" />, title: "Active Users", value: "5,234+", desc: "Eco-conscious individuals making a difference" },
    { icon: <Sun className="w-8 h-8" />, title: "Activities Logged", value: "50K+", desc: "Daily activities tracked globally" }
  ];

  // Updated features based on actual functionality
  const features = [
    {
      icon: <Activity className="w-7 h-7" />,
      title: "4-Category Tracking",
      description: "Comprehensive carbon tracking across Transport, Electricity, Waste, and Food",
      details: ["🚗 Transport with 14 car variants", "⚡ Electricity usage tracking", "🗑️ Waste with recycling multiplier", "🍎 Food with waste multiplier"],
      color: "green"
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Date Range Analytics",
      description: "View your carbon footprint for any specific date with our calendar picker",
      details: ["Pick any date", "See daily emissions", "Track progress over time", "Compare day by day"],
      color: "blue"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Visual Reports",
      description: "Beautiful charts and insights to understand your carbon impact",
      details: ["Donut chart breakdown", "Category comparison", "Export as PDF/CSV/JSON", "Share on social media"],
      color: "purple"
    },
    {
      icon: <Download className="w-7 h-7" />,
      title: "Export & Share",
      description: "Download your data or share your progress with friends",
      details: ["JSON export for developers", "CSV for spreadsheets", "PDF with charts", "Share on social platforms"],
      color: "amber"
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: "Smart Carbon Tips",
      description: "Get personalized tips based on your actual emission patterns",
      details: ["Category-specific advice", "Real-time suggestions", "Impact estimates", "Actionable recommendations"],
      color: "teal"
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Admin Dashboard",
      description: "Full control for administrators to manage users and emission factors",
      details: ["User management", "Emission factor CRUD", "Platform analytics", "User impersonation"],
      color: "rose"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-green-200/20"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateY(${scrollY * 0.02}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo Animation */}
          <div className="flex justify-center mb-8 animate-bounce">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                2.0
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block mt-2">
              CarbonWise
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your carbon footprint across Transport, Electricity, Waste, and Food. 
            Get insights, export reports, and make a difference for our planet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl text-lg border-2 border-gray-200 hover:border-green-500 hover:text-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Category Showcase - Updated to match actual categories */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Track 4 Key Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="text-center group cursor-pointer">
                  <div className={`w-16 h-16 mx-auto bg-${cat.color}-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:shadow-lg`}>
                    <div className={`text-${cat.color}-600`}>{cat.icon}</div>
                  </div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* IMPACT SECTION - INSPIRATIONAL QUOTES */}
      {/* ============================================ */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Wisdom for a Greener World
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Timeless quotes to inspire environmental action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quote 1 - Wangari Maathai */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-green-300 mb-2">"</div>
              <p className="text-white text-lg italic mb-6">
                It's the little things citizens do. That's what will make the difference. My little thing is planting trees.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">WM</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Wangari Maathai</p>
                  <p className="text-green-300 text-xs">Nobel Peace Prize Laureate</p>
                </div>
              </div>
            </div>

            {/* Quote 2 - David Attenborough */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-green-300 mb-2">"</div>
              <p className="text-white text-lg italic mb-6">
                The truth is: the natural world is changing. And we are totally dependent on that world.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">DA</span>
                </div>
                <div>
                  <p className="text-white font-semibold">David Attenborough</p>
                  <p className="text-green-300 text-xs">Natural Historian</p>
                </div>
              </div>
            </div>

            {/* Quote 3 - Greta Thunberg */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-green-300 mb-2">"</div>
              <p className="text-white text-lg italic mb-6">
                You are never too small to make a difference.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">GT</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Greta Thunberg</p>
                  <p className="text-green-300 text-xs">Climate Activist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second row of quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Quote 4 - John Muir */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-green-300 mb-2">"</div>
              <p className="text-white text-lg italic mb-6">
                In every walk with nature, one receives far more than he seeks.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JM</span>
                </div>
                <div>
                  <p className="text-white font-semibold">John Muir</p>
                  <p className="text-green-300 text-xs">Naturalist & Author</p>
                </div>
              </div>
            </div>

            {/* Quote 5 - Jacques Cousteau */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-green-300 mb-2">"</div>
              <p className="text-white text-lg italic mb-6">
                People protect what they love, and they love what they understand.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JC</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Jacques Cousteau</p>
                  <p className="text-green-300 text-xs">Ocean Explorer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inspirational footer */}
          <div className="mt-12 text-center border-t border-white/20 pt-8">
            <p className="text-green-200 text-lg flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5" />
              Let these words inspire your journey to a smaller footprint
              <Leaf className="w-5 h-5" />
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES SECTION - Updated to match actual functionality */}
      {/* ============================================ */}
      <section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Powerful Features
      </h2>
      <p className="text-xl text-gray-600">
        Everything you need to track your carbon footprint
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">4-Category Tracking</h3>
        <p className="text-sm text-gray-500">Transport, Electricity, Waste, Food</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Date Range Analytics</h3>
        <p className="text-sm text-gray-500">View any specific date</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Visual Reports</h3>
        <p className="text-sm text-gray-500">Charts & insights</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Download className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Export & Share</h3>
        <p className="text-sm text-gray-500">JSON, CSV, PDF, Social media</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Lightbulb className="w-6 h-6 text-teal-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Smart Tips</h3>
        <p className="text-sm text-gray-500">Personalized suggestions</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Shield className="w-6 h-6 text-rose-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Admin Panel</h3>
        <p className="text-sm text-gray-500">Full user & factor management</p>
      </div>
    </div>
  </div>
</section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
      <p className="text-xl text-gray-600">Three simple steps to start your journey</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      
      {/* Step 1 */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <span className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            1
          </span>
          <Users className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Account</h3>
        <p className="text-gray-600">
          Sign up for free with your email.
        </p>
      </div>

      {/* Step 2 */}
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            2
          </span>
          <Activity className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Activities</h3>
        <p className="text-gray-600">
          Log your daily activities across 4 categories.
        </p>
      </div>

      {/* Step 3 */}
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <span className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            3
          </span>
          <Award className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyze & Reduce</h3>
        <p className="text-gray-600">
          View reports and get personalized tips.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ============================================ */}
      {/* FINAL CTA SECTION */}
      {/* ============================================ */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Join thousands of users already tracking and reducing their carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-2xl text-lg hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER -*/}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo and description */}
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-lg font-bold text-white">CarbonWise</span>
              <span className="text-xs text-gray-500 ml-2">Track. Reduce. Make a Difference.</span>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-green-400 transition">Terms of Service</Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © 2026 CarbonWise
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}