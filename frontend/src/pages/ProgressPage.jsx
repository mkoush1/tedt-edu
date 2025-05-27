import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { decodeJWT } from "../utils/jwt";

// Circular Progress Component
const CircularProgress = ({ value, size = 100, strokeWidth = 10, color = "#592538", label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#gradient-${label})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#592538" />
            <stop offset="100%" stopColor="#7a334d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{value}%</span>
        {label && <span className="text-xs font-medium text-gray-500 mt-1">{label}</span>}
      </div>
    </div>
  );
};

// Card with drop shadow and rounded corners
const StatsCard = ({ title, value, icon, trend = null }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-[#592538]/10 flex items-center justify-center text-[#592538] mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex items-center">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {trend !== null && (
          <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${
            trend > 0 
              ? 'bg-green-100 text-green-700' 
              : trend < 0 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700'
          }`}>
            {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
    </div>
  );
};

const AssessmentTypeIcon = ({ type }) => {
  switch(type.toLowerCase()) {
    case 'leadership':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      );
    case 'problem-solving':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      );
    case 'communication':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
};

const ScoreIndicator = ({ score }) => {
  let bgColor, textColor, label;
  
  if (score >= 80) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
    label = 'Excellent';
  } else if (score >= 60) {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-700';
    label = 'Good';
  } else if (score >= 40) {
    bgColor = 'bg-amber-100';
    textColor = 'text-amber-700';
    label = 'Average';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
    label = 'Needs Improvement';
  }
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} flex items-center`}>
      <span className="mr-1">{Math.round(score)}%</span>
      <span>•</span>
      <span className="ml-1">{label}</span>
    </div>
  );
};

const ProgressPage = () => {
  const navigate = useNavigate();
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Decode token to get user ID
        const decodedToken = decodeJWT(token);
        if (!decodedToken || !decodedToken.userId) {
          console.error("Invalid token or missing userId");
          navigate("/login");
          return;
        }

        const userId = decodedToken.userId;
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        setUserData(userData);

        // Fetch completed assessments
        const response = await axios.get(
          `http://localhost:5001/api/assessments/status/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data || !response.data.data) {
          throw new Error("Failed to fetch progress data");
        }

        const completedData = response.data.data.completedAssessments || [];
        setCompletedAssessments(completedData);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setError("Failed to fetch progress data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [navigate]);

  const calculateAverageScore = () => {
    if (completedAssessments.length === 0) return 0;
    const totalScore = completedAssessments.reduce(
      (sum, assessment) => sum + assessment.score,
      0
    );
    return Math.round(totalScore / completedAssessments.length);
  };

  const calculateTrend = () => {
    // Simulated trend data
    return completedAssessments.length > 0 ? 5 : 0;
  };

  // Get icon for stats cards
  const getStatsIcon = (type) => {
    switch(type) {
      case 'completed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'score':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        );
      case 'progress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'time':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Progress Overview">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#592538] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-[#592538] text-lg font-medium">Loading progress data...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Progress Overview">
        <div className="flex items-center justify-center h-64 flex-col space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-red-500 text-xl font-medium">Error Loading Progress</div>
          <div className="text-gray-600 text-center max-w-md mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Progress Overview">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#592538] to-[#7a334d] rounded-xl shadow-md mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Your Progress Overview</h1>
              <p className="text-white text-opacity-90">
                Track your assessment progress and performance over time.
              </p>
            </div>
            <div>
              <CircularProgress 
                value={Math.round((completedAssessments.length / 3) * 100)} 
                size={120} 
                color="#FFFFFF" 
                label="Overall" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Completed Tests" 
          value={completedAssessments.length} 
          icon={getStatsIcon('completed')} 
          trend={calculateTrend()}
        />
        <StatsCard 
          title="Average Score" 
          value={`${calculateAverageScore()}%`} 
          icon={getStatsIcon('score')} 
          trend={calculateAverageScore() > 0 ? 8 : 0}
        />
        <StatsCard 
          title="Progress" 
          value={`${Math.round((completedAssessments.length / 3) * 100)}%`} 
          icon={getStatsIcon('progress')}
        />
        <StatsCard 
          title="Time Spent" 
          value={`${completedAssessments.length * 10} min`} 
          icon={getStatsIcon('time')}
        />
      </div>

      {/* Assessment Details */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Assessment Details</h2>
        </div>

        {completedAssessments.length > 0 ? (
          <div className="space-y-6">
            {completedAssessments.map((assessment, index) => (
              <div
                key={assessment._id || index}
                className="bg-white rounded-lg border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-[#592538]/10 flex items-center justify-center text-[#592538] mr-4">
                      <AssessmentTypeIcon type={assessment.assessmentType} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize mb-1">
                        {assessment.assessmentType} Assessment
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(assessment.completedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <ScoreIndicator score={assessment.score} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Score</span>
                    <span className="font-semibold text-gray-800">{Math.round(assessment.score)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#592538] to-[#7a334d] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(assessment.score)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => navigate(`/assessment/${assessment.assessmentType}/recommendations`)}
                    className="px-4 py-2 text-sm font-medium text-[#592538] hover:bg-[#592538]/5 rounded-lg transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Assessments Completed Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete your first assessment to see your progress and performance data here.
            </p>
            <button
              onClick={() => navigate('/assessments')}
              className="px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm font-medium mx-auto"
            >
              Start an Assessment
            </button>
          </div>
        )}
      </div>

      {/* Skills Distribution - Only show if assessments are completed */}
      {completedAssessments.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">Skills Distribution</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['leadership', 'problem-solving', 'communication'].map(skill => {
              const assessmentForSkill = completedAssessments.find(a => a.assessmentType === skill);
              const score = assessmentForSkill ? assessmentForSkill.score : 0;
              const completed = !!assessmentForSkill;

              return (
                <div key={skill} className="bg-white rounded-lg border border-gray-100 p-5 hover:shadow-sm transition-shadow duration-300 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-[#592538]/10 flex items-center justify-center text-[#592538] mb-4">
                    <AssessmentTypeIcon type={skill} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                    {skill.replace('-', ' ')}
                  </h3>
                  {completed ? (
                    <>
                      <CircularProgress value={Math.round(score)} size={90} label={`${Math.round(score)}%`} />
                      <div className="mt-4 w-full">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#592538] to-[#7a334d] h-2 rounded-full"
                            style={{ width: `${Math.round(score)}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">Not completed yet</p>
                      <button
                        onClick={() => navigate(`/assessment/${skill}`)}
                        className="px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm font-medium"
                      >
                        Take Assessment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProgressPage;
