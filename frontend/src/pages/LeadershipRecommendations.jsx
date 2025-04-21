import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAssessmentResults } from "../services/api";

const LeadershipRecommendations = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAssessmentResults("leadership");
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load assessment results");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] flex items-center justify-center">
        <div className="text-[#592538] text-xl">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] flex items-center justify-center">
        <div className="text-[#592538] text-xl">{error}</div>
      </div>
    );
  }

  const sections = [
    { name: "Vision", score: results?.scores?.vision || 0 },
    { name: "Ethics", score: results?.scores?.ethics || 0 },
    { name: "Communication", score: results?.scores?.communication || 0 },
    { name: "Team Management", score: results?.scores?.teamManagement || 0 },
    { name: "Decision Making", score: results?.scores?.decisionMaking || 0 },
    {
      name: "Emotional Intelligence",
      score: results?.scores?.emotionalIntelligence || 0,
    },
    { name: "Adaptability", score: results?.scores?.adaptability || 0 },
    { name: "Innovation", score: results?.scores?.innovation || 0 },
    { name: "Development", score: results?.scores?.development || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F8] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#592538]">
              Leadership Assessment Results
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-[#592538] bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#592538] mb-4">
                Your Leadership Profile
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6b7280" }}
                      tickLine={{ stroke: "#6b7280" }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fill: "#6b7280" }}
                      tickLine={{ stroke: "#6b7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="score" fill="#592538" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#592538] mb-4">
                Key Recommendations
              </h2>
              <div className="space-y-4">
                {results?.recommendations?.map((rec, index) => (
                  <div key={index} className="p-4 bg-[#592538]/5 rounded-lg">
                    <h3 className="font-semibold text-[#592538] mb-2">
                      {rec.area}
                    </h3>
                    <p className="text-gray-600 text-sm">{rec.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-[#592538] mb-4">
                Next Steps
              </h2>
              <p className="text-gray-600 mb-4">
                Based on your assessment results, we recommend focusing on the
                following areas:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results?.nextSteps?.map((step, index) => (
                  <div key={index} className="p-4 bg-[#592538]/5 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-[#592538] mr-3 text-lg">•</span>
                      <p className="text-gray-600">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipRecommendations;
