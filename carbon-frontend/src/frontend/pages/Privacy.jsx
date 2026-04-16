import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6">Last Updated: April 2026</p>
          
          <div className="space-y-4 text-gray-700">
            <p>• We collect your name, email, phone (optional), and daily activity data.</p>
            <p>• Your data is used only to calculate your carbon footprint and display reports.</p>
            <p>• We do not sell or share your personal information.</p>
            <p>• You can delete your account and all data anytime from Profile page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}