import React from "react";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({ assessment }) => {
  const navigate = useNavigate();

  const handleAssessmentStart = () => {
    navigate(`/assessment/${assessment._id}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full">
      <div className="h-48 bg-gray-100">
        <img
          src={assessment.image || "/eduSoft_logo.png"}
          alt={assessment.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-[#592538] mb-2">
            {assessment.title}
          </h3>
          <p className="text-gray-600 mb-4">{assessment.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <span className="mr-2">⏱️</span>
              {assessment.duration} minutes
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <span className="mr-2">📋</span>
              {assessment.category}
            </span>
          </div>
        </div>
        <button
          onClick={handleAssessmentStart}
          className="w-full px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentCard;
