import React from "react";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({ assessment }) => {
  const navigate = useNavigate();

  const handleAssessmentStart = () => {
    if (assessment.category === "Problem Solving") {
      if (assessment._id === "puzzle-game") {
        navigate("/assessment/puzzle-game");
      } else {
        navigate("/assessment/problem-solving");
      }
    } else {
      navigate(`/assessment/${assessment._id}`);
    }
  };

  // Helper function to get icon based on category
  const getCategoryIcon = () => {
    const category = assessment.category?.toLowerCase() || '';
    if (category.includes('leadership')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      );
    }
    if (category.includes('problem')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      );
    }
    if (category.includes('communication') || category.includes('english')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Helper function to get category color
  const getCategoryColor = () => {
    const category = assessment.category?.toLowerCase() || '';
    if (category.includes('leadership')) return '#4c1d95';
    if (category.includes('problem')) return '#0e7490';
    if (category.includes('communication') || category.includes('english')) return '#b45309';
    return '#592538';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <div className="h-40 bg-gradient-to-r relative overflow-hidden" 
        style={{ 
          backgroundImage: `linear-gradient(to right, ${getCategoryColor()}dd, ${getCategoryColor()}99)` 
        }}>
        <div className="absolute inset-0 bg-gray-900 opacity-10"></div>
        {assessment.image ? (
          <img
            src={assessment.image}
            alt={assessment.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {getCategoryIcon()}
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-md text-xs font-medium flex items-center" 
             style={{ color: getCategoryColor() }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {assessment.duration} min
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{assessment.category}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#592538] transition-colors mb-2">
          {assessment.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{assessment.description}</p>
        <div className="pt-2 mt-auto">
          <button
            onClick={handleAssessmentStart}
            className="w-full px-4 py-2.5 bg-white border border-[#592538] text-[#592538] rounded-lg hover:bg-[#592538] hover:text-white transition-all duration-300 text-sm font-medium flex items-center justify-center group-hover:bg-[#592538] group-hover:text-white"
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

export default AssessmentCard;
