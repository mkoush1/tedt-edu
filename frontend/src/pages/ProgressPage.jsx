import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import { decodeJWT } from "../utils/jwt";

const ProgressPage = () => {
  const navigate = useNavigate();
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          console.error('Invalid token or missing userId');
          navigate("/login");
          return;
        }

        const userId = decodedToken.userId;

        // Fetch completed assessments
        const response = await axios.get(
          `http://localhost:5000/api/assessments/status/${userId}`,
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

  if (loading) {
    return (
      <DashboardLayout title="Progress Overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#592538] text-xl">Loading progress...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Progress Overview">
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
    <DashboardLayout title="Progress Overview">
      <div className="space-y-8">
        {/* Progress Stats */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#592538]">Overall Progress</h2>
              <span className="text-4xl font-bold text-[#592538]">
                {Math.round((completedAssessments.length / 3) * 100)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#592538]">Completed Assessments</h2>
              <span className="text-4xl font-bold text-[#592538]">
                {completedAssessments.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#592538]">Average Score</h2>
              <span className="text-4xl font-bold text-[#592538]">
                {calculateAverageScore()}%
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Progress */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#592538] mb-6">Assessment Progress</h2>
          {completedAssessments.length === 0 ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[#592538] mb-2">
                No assessments completed yet
              </h3>
              <p className="text-gray-600">
                Start your learning journey by completing your first assessment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedAssessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-[#592538] capitalize">
                      {assessment.assessmentType} Assessment
                    </h3>
                    <span className="text-gray-600">
                      {new Date(assessment.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#592538] h-2.5 rounded-full"
                        style={{ width: `${assessment.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round(assessment.score)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
