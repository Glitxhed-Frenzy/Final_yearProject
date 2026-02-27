// src/frontend/admin/EmissionFactors.jsx
import { useState, useEffect } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";

export default function EmissionFactors() {
  const [factors, setFactors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // In real app, fetch from API
      // If no data, factors remains empty array
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasFactors = factors.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emission Factors</h1>
          <p className="text-gray-600 mt-1">
            {hasFactors 
              ? "Manage carbon conversion factors used in calculations"
              : "Add emission factors to enable carbon calculations"}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Factor
        </button>
      </div>

      {/* Search - Only show if there are factors */}
      {hasFactors && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search emission factors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Empty State */}
      {!hasFactors ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Emission Factors Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Emission factors are used to convert user activities into carbon emissions. Add your first factor to get started.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
            Add Your First Factor
          </button>
        </div>
      ) : (
        /* Table View - When data exists */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Factor</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Map factors here */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}