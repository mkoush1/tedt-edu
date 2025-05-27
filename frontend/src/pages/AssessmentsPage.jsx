import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { decodeJWT } from "../utils/jwt";
import api from "../services/api"; // Import the API service

const CompletedAssessmentCard = ({ assessment, onViewResults }) => {
  const canRetake = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(assessment.completedAt) < oneWeekAgo;
  };

  const getRetakeMessage = () => {
    if (canRetake()) {
      return "Available for Retake";
    }
    const nextRetake = new Date(assessment.completedAt);
    nextRetake.setDate(nextRetake.getDate() + 7);
    const daysLeft = Math.ceil((nextRetake - new Date()) / (1000 * 60 * 60 * 24));
    return `Can retake in ${daysLeft} days`;
  };

  // Function to get appropriate badge color
  const getBadgeColors = () => {
    if (canRetake()) {
      return "bg-green-100 text-green-700 border border-green-200";
    }
    return "bg-amber-100 text-amber-700 border border-amber-200";
  };

  // Function to get score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  // Function to get assessment icon based on type
  const getAssessmentIcon = (type) => {
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="border-b border-gray-100 bg-gradient-to-r from-[#592538]/5 to-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-[#592538]/10 flex items-center justify-center text-[#592538] mr-3 group-hover:bg-[#592538]/15 transition-all">
              {getAssessmentIcon(assessment.assessmentType)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#592538] transition-colors">
              {assessment.assessmentType.charAt(0).toUpperCase() +
                assessment.assessmentType.slice(1)}{" "}
              Assessment
            </h3>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${getBadgeColors()} shadow-sm`}>
            {getRetakeMessage()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="relative">
              <svg className="w-16 h-16" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" stroke="#E5E7EB" strokeWidth="4" />
                <circle 
                  cx="18" cy="18" r="16" 
                  stroke="url(#scoreGradient)" 
                  strokeWidth="4" 
                  strokeDasharray="100"
                  strokeDashoffset={100 - assessment.score}
                  transform="rotate(-90 18 18)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={
                      assessment.score >= 80 ? "#059669" : 
                      assessment.score >= 60 ? "#0284c7" : 
                      assessment.score >= 40 ? "#d97706" : "#dc2626"
                    } />
                    <stop offset="100%" stopColor={
                      assessment.score >= 80 ? "#10b981" : 
                      assessment.score >= 60 ? "#38bdf8" : 
                      assessment.score >= 40 ? "#fbbf24" : "#f87171"
                    } />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{Math.round(assessment.score)}%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 mb-1">Performance</p>
              <p className={`text-lg font-semibold ${getScoreColor(assessment.score)}`}>
                {assessment.score < 40 ? "Needs Improvement" : 
                 assessment.score < 60 ? "Average" :
                 assessment.score < 80 ? "Good" : "Excellent"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Completed on</p>
            <p className="text-sm font-medium text-gray-700 flex items-center justify-end">
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

        <div className="flex gap-3">
          <button
            onClick={() => onViewResults(assessment.assessmentType)}
            className="flex-1 px-4 py-2.5 bg-white text-[#592538] border border-[#592538] rounded-lg hover:bg-[#592538]/5 transition duration-300 text-sm font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Results
          </button>
          {canRetake() && (
            <button
              onClick={() => onViewResults(assessment.assessmentType, true)}
              className="flex-1 px-4 py-2.5 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm font-medium flex items-center justify-center shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AvailableAssessmentCard = ({ title, description, icon, onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-14 h-14 rounded-lg bg-[#592538]/10 flex items-center justify-center mr-4 text-[#592538] group-hover:bg-[#592538]/15 transition-colors shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#592538] transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm mb-6 pl-16">{description}</p>
        <div className="mt-auto">
          <button
            onClick={onClick}
            className="w-full px-4 py-2.5 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm font-medium flex items-center justify-center shadow-sm"
          >
            Start Assessment
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AssessmentsPage = () => {
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleViewResults = (assessmentType, isRetake = false) => {
    if (isRetake) {
      navigate(`/assessment/${assessmentType}`);
    } else {
      navigate(`/assessment/${assessmentType}/recommendations`);
    }
  };

  const availableAssessments = [
    {
      id: 'leadership',
      title: 'Leadership Skills',
      description: 'Evaluate your leadership potential and get personalized recommendations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      ),
      path: '/assessment/leadership'
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Test your analytical thinking and problem-solving abilities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      path: '/assessment/problem-solving'
    },
    {
      id: 'communication',
      title: 'Communication Skills Test',
      description: 'Assess your English language proficiency using CEFR standards (A1-C1 levels).',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      path: '/assessment/communication'
    }
  ];

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Decode token to get user ID
        const decodedToken = decodeJWT(token);
        if (!decodedToken || !decodedToken.userId) {
          console.error('Invalid token or missing userId');
          navigate("/login");
          return;
        }

        const userId = decodedToken.userId;
        console.log("Fetching completed assessments...");
        console.log("User ID from token:", userId);

        // Fetch completed assessments using the API service
        const completedResponse = await api.get(
          `/assessments/status/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!completedResponse.data) {
          throw new Error("Failed to fetch completed assessments");
        }

        const completedData = completedResponse.data.data || {};
        console.log("Completed assessments response:", completedData);
        
        const completedAssessments = completedData.completedAssessments || [];
        setCompletedAssessments(completedAssessments);
      } catch (err) {
        console.error("Error fetching assessments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout title="Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#592538] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-[#592538] text-lg font-medium">Loading assessments...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Assessments">
        <div className="flex items-center justify-center h-64 flex-col space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-red-500 text-xl font-medium">Error Loading Assessments</div>
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
    <DashboardLayout title="Assessments">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Assessments
            </h1>
            <p className="text-gray-600 mt-1">Take assessments to measure your skills and get personalized recommendations.</p>
          </div>
          <div className="bg-[#592538]/5 px-4 py-3 rounded-lg flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#592538]/10 text-[#592538]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Progress Overview</p>
              <p className="text-sm text-gray-500">
                {completedAssessments.length} / {completedAssessments.length + availableAssessments.length} Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Assessments Section */}
      {completedAssessments.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">Completed Assessments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAssessments.map((assessment) => (
              <CompletedAssessmentCard
                key={assessment._id}
                assessment={assessment}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Assessments Section */}
      <div>
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Available Assessments</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAssessments
            .filter(
              (a) =>
                !completedAssessments.some(
                  (ca) => ca.assessmentType === a.id
                )
            )
            .map((assessment) => (
              <AvailableAssessmentCard
                key={assessment.id}
                title={assessment.title}
                description={assessment.description}
                icon={assessment.icon}
                onClick={() => navigate(assessment.path)}
              />
            ))}
          {availableAssessments.filter(
            (a) => !completedAssessments.some((ca) => ca.assessmentType === a.id)
          ).length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">All Assessments Completed</h3>
              <p className="text-gray-500 mb-6 max-w-md">Great job! You have completed all available assessments. Check back later for new assessments or retake previous ones to improve your scores.</p>
              <button
                onClick={() => navigate('/progress')}
                className="px-4 py-2.5 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Your Progress
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentsPage;
