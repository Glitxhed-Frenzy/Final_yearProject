// src/frontend/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingDown, 
  Calendar,
  Loader,
  AlertCircle,
  Crown,
  Star,
  Target
} from "lucide-react";
import { leaderboardAPI } from '../../services/api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await leaderboardAPI.getLeaderboard();
      const data = response.data.data;
      
      setLeaderboard(data.leaderboard);
      setCurrentUser(data.currentUser);
      setCurrentMonth(data.currentMonth);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch(rank) {
      case 1:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-700 border-gray-200";
      case 3:
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load leaderboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadLeaderboard}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            {formatMonth(currentMonth)} - Lowest emissions win!
          </p>
          <p className="text-sm text-green-600 mt-1">
            🌿 Lower carbon footprint = Higher rank
          </p>
        </div>

        
{currentUser && (
  <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
    {currentUser.rank ? (
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            {currentUser.rank === 1 && <Crown className="w-8 h-8" />}
            {currentUser.rank === 2 && <Medal className="w-8 h-8" />}
            {currentUser.rank === 3 && <Medal className="w-8 h-8" />}
            {currentUser.rank > 3 && <Target className="w-8 h-8" />}
          </div>
          <div>
            <p className="text-green-100 text-sm">Your Rank</p>
            <p className="text-4xl font-bold">#{currentUser.rank}</p>
            <p className="text-green-100 text-sm mt-1">
              out of {totalUsers} users
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-100 text-sm">Your Monthly Emissions</p>
          <p className="text-3xl font-bold">{currentUser.emissions} kg</p>
          <p className="text-green-100 text-sm mt-1">CO₂ equivalent</p>
        </div>
      </div>
    ) : (
      <div className="text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8" />
        </div>
        <p className="text-xl font-semibold">Not on Leaderboard Yet</p>
        <p className="text-green-100 mt-2">
          {currentUser.accountAgeDays < 7 
            ? `⏳ You need to be active for 7 days (${currentUser.accountAgeDays}/7 days completed)`
            : !currentUser.hasActivities 
            ? "📝 Add your first activity to appear on leaderboard"
            : "🌟 Keep tracking your activities to appear next month!"
          }
        </p>
        {currentUser.accountAgeDays < 7 && (
          <div className="mt-4 bg-white/20 rounded-full h-2 max-w-md mx-auto">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${(currentUser.accountAgeDays / 7) * 100}%` }}
            />
          </div>
        )}
      </div>
    )}
  </div>
)}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total CO₂</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No data available for this month</p>
                      <p className="text-sm mt-1">Add activities to appear on leaderboard</p>
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((user) => (
                    <tr 
                      key={user.userId} 
                      className={`hover:bg-gray-50 transition-colors ${
                        currentUser?.rank === user.rank ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                          <span className="font-semibold text-gray-900">#{user.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">{user.totalEmissions} kg</span>
                        <p className="text-xs text-gray-500">CO₂ emissions</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRankBadgeColor(user.rank)} border`}>
                          {user.rank === 1 && <Crown className="w-3 h-3" />}
                          {user.rank === 2 && <Medal className="w-3 h-3" />}
                          {user.rank === 3 && <Medal className="w-3 h-3" />}
                          {user.rank === 1 && "Climate Champion"}
                          {user.rank === 2 && "Eco Warrior"}
                          {user.rank === 3 && "Green Guardian"}
                          {user.rank > 3 && `Rank #${user.rank}`}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">How it works</h3>
              <p className="text-sm text-blue-700 mt-1">
                Lower carbon emissions = Higher rank on the leaderboard. 
                Track your daily activities to reduce your footprint and climb the ranks!
                Leaderboard resets every month for a fresh competition.
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={loadLeaderboard}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}