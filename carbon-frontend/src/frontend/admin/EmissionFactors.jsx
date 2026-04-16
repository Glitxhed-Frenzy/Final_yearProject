// src/frontend/admin/EmissionFactors.jsx
import { useState, useEffect } from "react";
import { 
  Search, 
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle
} from "lucide-react";
import { adminAPI } from '../../services/api';

export default function EmissionFactors() {
  const [factors, setFactors] = useState([]);
  const [filteredFactors, setFilteredFactors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFactor, setEditingFactor] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    activityId: "",
    category: "transport",
    name: "",
    factor: "",
    unit: "",
    description: "",
    source: ""
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchFactors();
  }, []);

  useEffect(() => {
    const filtered = factors.filter(factor => 
      factor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.activityId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFactors(filtered);
  }, [searchTerm, factors]);

  const fetchFactors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getEmissionFactors();
      console.log('Emission factors:', response.data);
      setFactors(response.data.data || []);
      setFilteredFactors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching factors:", error);
      setError("Failed to load emission factors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.activityId.trim()) {
      errors.activityId = "Activity ID is required";
    }
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.factor) {
      errors.factor = "Factor is required";
    } else if (isNaN(formData.factor) || formData.factor <= 0) {
      errors.factor = "Factor must be a positive number";
    }
    
    if (!formData.unit.trim()) {
      errors.unit = "Unit is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingFactor) {
        await adminAPI.updateEmissionFactor(editingFactor._id, formData);
        showSuccessMessage("Emission factor updated successfully!");
      }
      
      await fetchFactors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving factor:", error);
      alert(error.response?.data?.message || "Failed to save emission factor");
    }
  };

  const handleEdit = (factor) => {
    setEditingFactor(factor);
    setFormData({
      activityId: factor.activityId,
      category: factor.category,
      name: factor.name,
      factor: factor.factor,
      unit: factor.unit,
      description: factor.description || "",
      source: factor.source || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this emission factor?")) {
      try {
        await adminAPI.deleteEmissionFactor(id);
        await fetchFactors();
        showSuccessMessage("Emission factor deleted successfully!");
      } catch (error) {
        console.error("Error deleting factor:", error);
        alert("Failed to delete emission factor");
      }
    }
  };

  const resetForm = () => {
    setEditingFactor(null);
    setFormData({
      activityId: "",
      category: "transport",
      name: "",
      factor: "",
      unit: "",
      description: "",
      source: ""
    });
    setFormErrors({});
  };

  const categories = [
    { value: "transport", label: "Transport", color: "purple" },
    { value: "electricity", label: "Electricity", color: "blue" },
    { value: "waste", label: "Waste", color: "emerald" },
    { value: "food", label: "Food", color: "amber" }
  ];

  const getCategoryColorClass = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    if (!category) return "bg-gray-100 text-gray-700";
    
    const colorMap = {
      purple: "bg-purple-100 text-purple-700",
      blue: "bg-blue-100 text-blue-700",
      emerald: "bg-emerald-100 text-emerald-700",
      amber: "bg-amber-100 text-amber-700"
    };
    return colorMap[category.color] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emission factors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchFactors}
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasFactors = factors.length > 0;

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emission Factors</h1>
        <p className="text-gray-600 mt-1">
          {hasFactors 
            ? `Managing ${factors.length} carbon conversion factors`
            : "No emission factors found"}
        </p>
      </div>

      {hasFactors && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, category, or activity ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      {!hasFactors ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Emission Factors Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No emission factors are currently available in the database.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Activity ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Factor</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFactors.map((factor) => {
                  return (
                    <tr key={factor._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        {factor.activityId}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {factor.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColorClass(factor.category)}`}>
                          {factor.category.charAt(0).toUpperCase() + factor.category.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {factor.factor}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {factor.unit}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(factor)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(factor._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Showing {filteredFactors.length} of {factors.length} factors
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Emission Factor
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="activityId"
                  value={formData.activityId}
                  onChange={handleInputChange}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                  placeholder="e.g., car_sedan_petrol"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Sedan - Petrol"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Factor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="factor"
                    value={formData.factor}
                    onChange={handleInputChange}
                    step="0.001"
                    min="0"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.factor ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.124"
                  />
                  {formErrors.factor && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.factor}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      formErrors.unit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="kg CO₂ per km"
                  />
                  {formErrors.unit && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., EPA 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional details about this factor..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Update Factor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}