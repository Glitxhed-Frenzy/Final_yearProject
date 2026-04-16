export default function MetricCard({ title, value, subtitle, highlight, trend, trendValue, icon, color = "green" }) {
  const colorClasses = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-violet-600",
    orange: "from-amber-500 to-orange-600",
    red: "from-rose-500 to-pink-600"
  };

  const bgColorClasses = {
    green: "bg-gradient-to-br from-green-500 to-emerald-600",
    blue: "bg-gradient-to-br from-blue-500 to-cyan-600",
    purple: "bg-gradient-to-br from-purple-500 to-violet-600",
    orange: "bg-gradient-to-br from-amber-500 to-orange-600",
    red: "bg-gradient-to-br from-rose-500 to-pink-600"
  };

  return (
    <div
      className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md
      ${highlight 
        ? `${bgColorClasses[color]} text-white` 
        : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${highlight ? "text-white/90" : "text-gray-600"}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${highlight ? "text-white" : "text-gray-900"}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${highlight ? "text-white/80" : "text-gray-500"}`}>
              {subtitle}
            </p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center mt-3">
              <span className={`inline-flex items-center text-sm ${highlight ? "text-white" : trend === "up" ? "text-red-600" : "text-green-600"}`}>
                {trend === "up" ? "↗" : "↘"}
                <span className="ml-1 font-medium">
                  {trendValue}% {trend === "up" ? "increase" : "decrease"}
                </span>
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-xl ${highlight ? "bg-white/20" : "bg-gray-100"}`}>
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}