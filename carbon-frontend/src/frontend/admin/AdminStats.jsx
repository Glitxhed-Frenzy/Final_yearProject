// src/frontend/admin/AdminStats.jsx
import { useState, useEffect } from "react";
import { BarChart3, AlertCircle } from "lucide-react";
import DonutPlaceholder from "../components/DonutPlaceholder";

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      // Check if there's real data
      // setHasData(true/false based on actual data
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Statistics</h1>
      <p className="text-gray-600 mb-6">
        {hasData 
          ? "Detailed insights and performance metrics"
          : "Analytics will appear once there is user data"}
      </p>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Statistics Available</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Statistics and analytics will be displayed here once users start adding activities and tracking their carbon footprint.
          </p>
        </div>
      ) : (
        <DonutPlaceholder
          centerLabel="Distribution"
          data={[
            { name: "Electricity", value: 60 },
            { name: "Transport", value: 25 },
            { name: "Food", value: 15 },
          ]}
        />
      )}
    </>
  );
}