import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import AssessmentCard from "../components/AssessmentCard";
import axios from "axios";
import { decodeJWT } from "../utils/jwt";
import api from "../services/api";
// import '../styles/Dashboard.css';

const SidebarItem = ({ icon, text, active = false }) => (
  <div className={`sidebar-item ${active ? "active" : ""}`}>
    <span className="sidebar-icon">{icon}</span>
    <span className="sidebar-text">{text}</span>
  </div>
);

const StatCard = ({ icon, value, label, trend, color = "#592538" }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-gradient-to-br opacity-10 from-transparent to-current transition-opacity group-hover:opacity-20" style={{ color }}></div>
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 rounded-lg bg-opacity-15 flex items-center justify-center shadow-sm" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <p className="text-2xl font-bold" style={{ color }}>
            {value}
          </p>
          {trend && (
            <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0 
                ? "bg-green-100 text-green-700" 
                : trend < 0 
                  ? "bg-red-100 text-red-700" 
                  : "bg-gray-100 text-gray-700"
            }`}>
              {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
      </div>
    </div>
  </div>
);

const ProgressRing = ({ progress }) => {
  const radius = 42;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#592538" />
            <stop offset="100%" stopColor="#7a334d" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-[#592538]">{progress}%</div>
        <div className="text-xs text-gray-500 font-medium">Completed</div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#4338ca" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>,
      value: "0", 
      label: "Completed Tests", 
      trend: 0, 
      color: "#4338ca" 
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#0891b2" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>, 
      value: "0", 
      label: "Available Tests", 
      trend: null, 
      color: "#0891b2" 
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#592538" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>, 
      value: "0%", 
      label: "Overall Progress", 
      trend: 0, 
      color: "#592538" 
    },
    { 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#ca8a04" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>, 
      value: "0", 
      label: "Time Spent (min)", 
      trend: null, 
      color: "#ca8a04" 
    },
  ]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchDashboardData = async () => {
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

      // Fetch user data for profile
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      setUserName(userData.name || "User");

      // Fetch available assessments
      const assessmentsResponse = await api.get("/assessments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch user's assessment status
      const statusResponse = await api.get(`/assessments/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const status = statusResponse.data.data;

      // Update progress animation
      setProgressPercentage(Math.round(status.progress));

      // Update stats with some simulated trends
      const newStats = [...stats];
      newStats[0].value = status.totalCompleted.toString(); // Completed Tests
      newStats[0].trend = status.totalCompleted > 0 ? 5 : 0; // Simulated 5% increase if tests are completed
      newStats[1].value = status.totalAvailable.toString(); // Available Tests
      newStats[2].value = `${Math.round(status.progress)}`; // Progress (without % sign)
      newStats[2].trend = Math.round(status.progress) > 0 ? 12 : 0; // Simulated 12% increase if progress exists
      newStats[3].value = calculateTimeSpent(status.completedAssessments || []); // Time spent
      setStats(newStats);

      // Set recent assessments (last 3 completed)
      const completed = status.completedAssessments || [];
      setRecentAssessments(completed.slice(0, 3));

      // Update assessments to show only available ones
      const completedTypes = status.completedAssessments.map(
        (a) => a.assessmentType
      );
      const availableAssessments = assessmentsResponse.data.filter(
        (assessment) => !completedTypes.includes(assessment.category)
      );
      setAssessments(availableAssessments);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  // Helper function to calculate time spent from completed assessments
  const calculateTimeSpent = (completedAssessments) => {
    // Calculate based on 10 minutes per assessment (simulated data)
    return (completedAssessments.length * 10).toString();
  };

  // Function to get assessment icon based on type
  const getAssessmentIcon = (type) => {
    switch(type) {
      case 'leadership':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        );
      case 'problem-solving':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "assessmentStatus") {
        fetchDashboardData(); // Refresh dashboard data when assessment status changes
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#592538] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-[#592538] text-lg font-medium">Loading your dashboard...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center h-64 flex-col space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-red-500 text-xl font-medium">Error Loading Dashboard</div>
          <div className="text-gray-600 text-center max-w-md mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 flex items-center"
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
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#592538] to-[#7a334d] rounded-xl shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-10 w-48 h-48 bg-white opacity-5 rounded-full hidden lg:block"></div>
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Welcome back, {userName}!</h2>
              <p className="text-white text-opacity-90 max-w-xl leading-relaxed">
                Track your progress, take assessments, and improve your skills with our personalized learning platform.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => navigate('/assessments')} 
                className="px-5 py-2.5 bg-white text-[#592538] rounded-lg hover:bg-opacity-90 transition duration-300 font-medium flex items-center shadow-md hover:shadow-lg"
              >
                Take Assessment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Your Progress
          </h2>
          <div className="flex justify-center my-4">
            <ProgressRing progress={progressPercentage} />
          </div>
          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Leadership Skills</span>
                <span className="text-sm font-semibold text-[#592538]">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#592538] to-[#7a334d] h-2.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Problem Solving</span>
                <span className="text-sm font-semibold text-[#592538]">40%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#592538] to-[#7a334d] h-2.5 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Communication</span>
                <span className="text-sm font-semibold text-[#592538]">75%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#592538] to-[#7a334d] h-2.5 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Assessments
            </h2>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/my-assessments')}
                className="text-[#592538] hover:text-[#6d2c44] text-sm font-medium transition-colors flex items-center"
              >
                View History
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            <button 
              onClick={() => navigate('/assessments')}
              className="text-[#592538] hover:text-[#6d2c44] text-sm font-medium transition-colors flex items-center"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
          </div>
          
          {recentAssessments.length > 0 ? (
            <div className="space-y-4">
              {recentAssessments.map((assessment, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[#592538]/10 flex items-center justify-center text-[#592538] mr-4 group-hover:bg-[#592538]/15 transition-all duration-300">
                    {getAssessmentIcon(assessment.assessmentType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800 group-hover:text-[#592538] transition-colors">
                        {assessment.assessmentType.charAt(0).toUpperCase() + assessment.assessmentType.slice(1)} Assessment
                      </h3>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                        assessment.score >= 70 
                          ? 'bg-green-100 text-green-700' 
                          : assessment.score >= 50 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {Math.round(assessment.score)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(assessment.completedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/assessment/${assessment.assessmentType}/recommendations`)}
                    className="ml-2 p-2 text-gray-400 hover:text-[#592538] rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Assessments Completed Yet</h3>
              <p className="text-gray-500 text-sm mb-4">Complete your first assessment to see results here.</p>
              <button
                onClick={() => navigate('/assessments')}
                className="px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300 text-sm shadow-sm hover:shadow-md"
              >
                Start an Assessment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Available Assessments Section */}
      {assessments.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#592538]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Recommended Assessments
        </h2>
            <button 
              onClick={() => navigate('/assessments')}
              className="text-[#592538] hover:text-[#6d2c44] text-sm font-medium transition-colors flex items-center"
            >
              See All Assessments
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.slice(0, 3).map((assessment) => (
            <AssessmentCard key={assessment._id} assessment={assessment} />
          ))}
        </div>
      </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
