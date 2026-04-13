import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6">Last Updated: April 2026</p>
          
          <div className="space-y-4 text-gray-700">
            <p>• You must use a valid Gmail, Yahoo, or Outlook email to register.</p>
            <p>• Provide truthful activity data. False entries may lead to account suspension.</p>
            <p>• You can delete your account anytime.</p>
            <p>• CarbonWise is for awareness only – not professional advice.</p>
            <p>• Continued use means you accept these terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}