// src/frontend/components/DonutPlaceholder.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#16a34a", "#22c55e", "#86efac", "#bbf7d0", "#059669", "#10b981"];

export default function DonutPlaceholder({ data, centerLabel }) {
  const chartData = data.length === 1 && data[0].name === "No Data" && centerLabel === "0 kg" 
    ? [{ name: "No Data", value: 1 }]
    : data.filter(item => item.value > 0);
  
  if (chartData.length === 0) {
    return (
      <div className="relative bg-white rounded-2xl shadow-sm border p-4 h-64 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-800">{centerLabel}</span>
          <p className="text-xs text-gray-500">Total CO₂</p>
        </div>
      </div>
    </div>
  );
}