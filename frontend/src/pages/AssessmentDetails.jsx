import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // Import the API service
// import '../styles/AssessmentDetails.css';

const AssessmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.get(`/assessments/${id}`);
        setAssessment(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleStartQuiz = () => {
    navigate(`/assessment/quiz/${assessment.category.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] flex items-center justify-center">
        <div className="text-[#592538] text-xl">Loading...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] flex items-center justify-center">
        <div className="text-[#592538] text-xl">Assessment not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F8] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative h-64 bg-[#592538]">
            <img
              src={assessment.image || "/eduSoft_logo.png"}
              alt={assessment.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white px-6 text-center">
                {assessment.title}
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Info Section */}
            <div className="flex flex-wrap gap-6 mb-8 text-center">
              <div className="flex-1 bg-[#592538]/5 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="text-lg font-semibold text-[#592538]">
                  {assessment.category}
                </div>
              </div>
              <div className="flex-1 bg-[#592538]/5 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Duration</div>
                <div className="text-lg font-semibold text-[#592538]">
                  {assessment.duration} minutes
                </div>
              </div>
              <div className="flex-1 bg-[#592538]/5 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Questions</div>
                <div className="text-lg font-semibold text-[#592538]">20</div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#592538] mb-4">
                About this Assessment
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {assessment.description}
              </p>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#592538] mb-4">
                Instructions
              </h2>
              <div className="bg-[#592538]/5 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#592538] mr-3">•</span>
                    <span className="text-gray-600">
                      Read each question carefully before answering
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#592538] mr-3">•</span>
                    <span className="text-gray-600">
                      You have {assessment.duration} minutes to complete the
                      assessment
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#592538] mr-3">•</span>
                    <span className="text-gray-600">
                      You cannot pause the assessment once started
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#592538] mr-3">•</span>
                    <span className="text-gray-600">
                      Ensure you have a stable internet connection
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#592538] mr-3">•</span>
                    <span className="text-gray-600">
                      Answer all questions to get your detailed results
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 bg-gray-100 text-[#592538] rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleStartQuiz}
                className="flex-1 px-6 py-3 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetails;
