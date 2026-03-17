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
  Droplets,
  Laptop,
  Award,
  Clock,
  Coins,
  TreePine,
  Wind,
  Sun
} from "lucide-react";

export default function Welcome() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories data for interactive section
  const categories = [
    { icon: <Car className="w-6 h-6" />, name: "Transport", color: "purple", desc: "Track car, bus, train & plane emissions" },
    { icon: <Home className="w-6 h-6" />, name: "Home Energy", color: "blue", desc: "Monitor electricity, AC & heating usage" },
    { icon: <Laptop className="w-6 h-6" />, name: "Electronics", color: "indigo", desc: "Calculate device energy consumption" },
    { icon: <Droplets className="w-6 h-6" />, name: "Water", color: "cyan", desc: "Track showers, laundry & water usage" },
    { icon: <Apple className="w-6 h-6" />, name: "Food", color: "amber", desc: "Monitor diet & food choices impact" }
  ];

  // Impact stats (replacing the numbers)
  const impacts = [
    { icon: <TreePine className="w-8 h-8" />, title: "Trees Saved", value: "5,234", desc: "Equivalent to 10 football fields" },
    { icon: <Wind className="w-8 h-8" />, title: "CO₂ Reduced", value: "125 tons", desc: "Same as taking 25 cars off road" },
    { icon: <Sun className="w-8 h-8" />, title: "Clean Energy", value: "850 MWh", desc: "Powers 80 homes for a year" }
  ];

  // Features with more detail
  const features = [
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Smart Tracking",
      description: "Automatically calculate your carbon footprint based on daily activities",
      details: ["5 categories", "Real-time calculations", "Historical data"],
      color: "green"
    },
    {
      icon: <TrendingDown className="w-7 h-7" />,
      title: "Progress Tracking",
      description: "Watch your carbon footprint decrease over time",
      details: ["Monthly reports", "Trend analysis", "Goal setting"],
      color: "blue"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Personalized Goals",
      description: "Set and track personal reduction goals",
      details: ["Custom targets", "Progress alerts", "Achievement badges"],
      color: "purple"
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community",
      description: "Join a community of eco-conscious individuals",
      details: ["Share tips", "Group challenges", "Leaderboards"],
      color: "amber"
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Real Impact",
      description: "See the real-world impact of your efforts",
      details: ["Carbon equivalents", "Visual representations", "Impact reports"],
      color: "rose"
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Smart Insights",
      description: "Get personalized tips and insights",
      details: ["AI recommendations", "Pattern detection", "Eco tips"],
      color: "teal"
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

          {/* Headline - UPDATED */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block mt-2">
              CarbonWise
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of eco-conscious individuals making a difference. 
            Measure, track, and reduce your environmental impact today.
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

          {/* REPLACED STATS WITH CATEGORY SHOWCASE */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Track Everything That Matters</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
      {/* IMPACT SECTION - WITH INSPIRING QUOTES */}
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
      {/* FEATURES SECTION (Enhanced) */}
      {/* ============================================ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand and reduce your carbon footprint
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${feature.color}-600`}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            <div className="text-center relative">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </span>
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up for free in less than a minute. No credit card required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </span>
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Activities</h3>
              <p className="text-gray-600">
                Log your daily activities across 5 categories: Transport, Home, Electronics, Water, Food.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </span>
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make Impact</h3>
              <p className="text-gray-600">
                Get insights, earn badges, and track your progress as you reduce your carbon footprint.
              </p>
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="mt-16 bg-gray-50 rounded-3xl p-8 max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Journey Timeline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-0 bg-green-500 h-full rounded-full group-hover:w-full transition-all duration-1000"></div>
                </div>
                <span className="text-sm text-gray-500">Week 1: Get started</span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 font-bold">2</span>
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                <span className="text-sm text-gray-400">Week 4: See progress</span>
              </div>
              <div className="flex items-center gap-4 opacity-30">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 font-bold">3</span>
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                <span className="text-sm text-gray-400">Month 3: Make impact</span>
              </div>
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

      {/* ============================================ */}
      {/* FOOTER - UPDATED */}
      {/* ============================================ */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo and description - UPDATED */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold text-white">CarbonWise</span>
              </div>
              <p className="text-sm">
                Empowering individuals to track, understand, and reduce their carbon footprint for a sustainable future.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
                <li><Link to="/features" className="hover:text-green-400 transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-green-400 transition">Pricing</Link></li>
                <li><Link to="/blog" className="hover:text-green-400 transition">Blog</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-green-400 transition">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-green-400 transition">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-green-400 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright - UPDATED */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© 2024 CarbonWise. All rights reserved. Made with ❤️ for a greener planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}