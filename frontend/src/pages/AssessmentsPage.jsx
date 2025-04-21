import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { decodeJWT } from "../utils/jwt";

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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#592538]">
            {assessment.assessmentType.charAt(0).toUpperCase() +
              assessment.assessmentType.slice(1)}{" "}
            Assessment
          </h3>
          <span className={`text-sm px-3 py-1 rounded-full ${
            canRetake() ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {getRetakeMessage()}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-gray-600">
            <span>Score:</span>
            <span className="font-semibold text-[#592538]">
              {Math.round(assessment.score)}%
            </span>
          </div>

          <div className="text-sm text-gray-500">
            Completed on:{" "}
            {new Date(assessment.completedAt).toLocaleDateString()}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onViewResults(assessment.assessmentType)}
              className="flex-1 px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300"
            >
              View Results
            </button>
            {canRetake() && (
              <button
                onClick={() => onViewResults(assessment.assessmentType, true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Retake
              </button>
            )}
          </div>
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

        // Fetch completed assessments
        const completedResponse = await axios.get(
          `http://localhost:5000/api/assessments/status/${userId}`,
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
      <DashboardLayout title="Completed Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#592538] text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Completed Assessments">
        <div className="flex items-center justify-center h-64 flex-col space-y-4">
          <div className="text-red-500 text-xl">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Completed Assessments">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-[#592538] mb-6">
            Your Completed Assessments
          </h2>
          {completedAssessments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[#592538] mb-2">
                No Completed Assessments Yet
              </h3>
              <p className="text-gray-600">
                Start an assessment to begin your skill evaluation journey.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedAssessments.map((assessment) => (
                <CompletedAssessmentCard
                  key={assessment._id}
                  assessment={assessment}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AssessmentsPage;
