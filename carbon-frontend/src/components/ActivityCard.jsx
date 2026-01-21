export default function ActivityCard({ title, category, date, emission, icon }) {
  const getCategoryColor = (cat) => {
    switch(cat?.toLowerCase()) {
      case 'electricity': return 'bg-blue-100 text-blue-700';
      case 'transport': return 'bg-purple-100 text-purple-700';
      case 'food': return 'bg-amber-100 text-amber-700';
      case 'travel': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-green-300 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 group-hover:scale-110 transition-transform">
          <span className="text-lg">{icon || "📊"}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <div className="flex items-center space-x-3 mt-1">
            {category && (
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(category)}`}>
                {category}
              </span>
            )}
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">{emission} kg</p>
        <p className="text-xs text-gray-500">CO₂ emissions</p>
      </div>
    </div>
  );
}