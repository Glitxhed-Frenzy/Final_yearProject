// src/frontend/admin/EmissionFactors.jsx
import { useState, useEffect } from "react";
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X,
  Zap,
  Car,
  Utensils,
  ShoppingBag,
  AlertCircle
} from "lucide-react";

// Mock data - replace with API call later
const initialFactors = [
  {
    id: 1,
    category: "electricity",
    name: "Grid Average (India)",
    factor: 0.82,
    unit: "kWh",
    source: "CEA India 2023",
    description: "Average CO₂ emissions per kWh from Indian grid",
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    category: "transport",
    name: "Petrol Car",
    factor: 0.20,
    unit: "km",
    source: "IPCC 2019",
    description: "Average sedan, 12 km/l efficiency",
    lastUpdated: "2024-01-10"
  },
  {
    id: 3,
    category: "transport",
    name: "Diesel Car",
    factor: 0.18,
    unit: "km",
    source: "IPCC 2019",
    description: "Average, 15 km/l efficiency",
    lastUpdated: "2024-01-10"
  },
  {
    id: 4,
    category: "food",
    name: "Beef",
    factor: 27.0,
    unit: "kg",
    source: "Poore & Nemecek, 2018",
    description: "Highest emission food item",
    lastUpdated: "2024-01-05"
  },
  {
    id: 5,
    category: "food",
    name: "Chicken",
    factor: 6.9,
    unit: "kg",
    source: "Poore & Nemecek, 2018",
    description: "Poultry meat",
    lastUpdated: "2024-01-05"
  },
  {
    id: 6,
    category: "purchases",
    name: "Smartphone",
    factor: 70.0,
    unit: "unit",
    source: "Apple Environmental Report",
    description: "Manufacturing emissions only",
    lastUpdated: "2024-01-20"
  }
];

const categoryIcons = {
  electricity: <Zap className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  purchases: <ShoppingBag className="w-4 h-4" />
};

const categoryColors = {
  electricity: "bg-blue-100 text-blue-700",
  transport: "bg-purple-100 text-purple-700",
  food: "bg-amber-100 text-amber-700",
  purchases: "bg-rose-100 text-rose-700"
};

export default function EmissionFactors() {
  const [factors, setFactors] = useState(initialFactors);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFactor, setNewFactor] = useState({
    category: "electricity",
    name: "",
    factor: "",
    unit: "",
    source: "",
    description: ""
  });

  // Filter factors based on search
  const filteredFactors = factors.filter(factor =>
    factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    const factorToEdit = factors.find(f => f.id === id);
    setEditingId(id);
    setEditForm({ ...factorToEdit });
  };

  const handleSave = (id) => {
    setFactors(factors.map(factor =>
      factor.id === id ? { ...editForm, lastUpdated: new Date().toISOString().split('T')[0] } : factor
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this emission factor?")) {
      setFactors(factors.filter(factor => factor.id !== id));
    }
  };

  const handleAddFactor = () => {
    if (!newFactor.name || !newFactor.factor || !newFactor.unit) {
      alert("Please fill in all required fields");
      return;
    }

    const newId = Math.max(...factors.map(f => f.id)) + 1;
    setFactors([
      ...factors,
      {
        id: newId,
        ...newFactor,
        factor: parseFloat(newFactor.factor),
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ]);
    
    setNewFactor({
      category: "electricity",
      name: "",
      factor: "",
      unit: "",
      source: "",
      description: ""
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emission Factors</h1>
          <p className="text-gray-600 mt-1">
            Manage carbon conversion factors used in calculations
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Factor
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Electricity</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {factors.filter(f => f.category === 'electricity').length}
              </p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Transport</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {factors.filter(f => f.category === 'transport').length}
              </p>
            </div>
            <Car className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700">Food</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {factors.filter(f => f.category === 'food').length}
              </p>
            </div>
            <Utensils className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-700">Purchases</p>
              <p className="text-2xl font-bold text-rose-900 mt-1">
                {factors.filter(f => f.category === 'purchases').length}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search emission factors by name, category, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Add New Factor Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-900">Add New Emission Factor</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newFactor.category}
                onChange={(e) => setNewFactor({...newFactor, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
              >
                <option value="electricity">Electricity</option>
                <option value="transport">Transport</option>
                <option value="food">Food</option>
                <option value="purchases">Purchases</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factor Name *
              </label>
              <input
                type="text"
                value={newFactor.name}
                onChange={(e) => setNewFactor({...newFactor, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
                placeholder="e.g., Petrol Car, Beef, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emission Factor (kg CO₂) *
              </label>
              <input
                type="number"
                step="0.01"
                value={newFactor.factor}
                onChange={(e) => setNewFactor({...newFactor, factor: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
                placeholder="e.g., 0.20"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <input
                type="text"
                value={newFactor.unit}
                onChange={(e) => setNewFactor({...newFactor, unit: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
                placeholder="e.g., km, kg, kWh"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source/Reference
              </label>
              <input
                type="text"
                value={newFactor.source}
                onChange={(e) => setNewFactor({...newFactor, source: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
                placeholder="e.g., IPCC 2019, CEA India"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newFactor.description}
                onChange={(e) => setNewFactor({...newFactor, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl"
                rows="2"
                placeholder="Brief description of this emission factor..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFactor}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700"
            >
              Add Factor
            </button>
          </div>
        </div>
      )}

      {/* Factors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Factor</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Source</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFactors.map((factor) => (
                <tr key={factor.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[factor.category]}`}>
                      {categoryIcons[factor.category]}
                      {factor.category.charAt(0).toUpperCase() + factor.category.slice(1)}
                    </span>
                  </td>
                  
                  <td className="py-3 px-4">
                    {editingId === factor.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{factor.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{factor.description}</p>
                      </div>
                    )}
                  </td>
                  
                  <td className="py-3 px-4">
                    {editingId === factor.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.factor}
                        onChange={(e) => setEditForm({...editForm, factor: parseFloat(e.target.value)})}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{factor.factor} kg</span>
                    )}
                  </td>
                  
                  <td className="py-3 px-4">
                    {editingId === factor.id ? (
                      <input
                        type="text"
                        value={editForm.unit}
                        onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <span className="text-gray-700">per {factor.unit}</span>
                    )}
                  </td>
                  
                  <td className="py-3 px-4">
                    {editingId === factor.id ? (
                      <input
                        type="text"
                        value={editForm.source}
                        onChange={(e) => setEditForm({...editForm, source: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <span className="text-gray-700">{factor.source}</span>
                    )}
                  </td>
                  
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">{factor.lastUpdated}</span>
                  </td>
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {editingId === factor.id ? (
                        <>
                          <button
                            onClick={() => handleSave(factor.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(factor.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(factor.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFactors.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No emission factors found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term or{" "}
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-green-600 hover:underline"
                >
                  clear search
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">About Emission Factors</h4>
            <p className="text-sm text-blue-800 mt-1">
              These factors convert user activities into carbon emissions. 
              Use scientifically validated sources (IPCC, CEA, peer-reviewed studies). 
              Factors should be updated annually to reflect current data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}