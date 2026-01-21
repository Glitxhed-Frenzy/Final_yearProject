import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#16a34a", "#22c55e", "#86efac", "#bbf7d0"];

export default function DonutPlaceholder({ data, centerLabel }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm text-gray-500">{centerLabel}</span>
      </div>
    </div>
  );
}
