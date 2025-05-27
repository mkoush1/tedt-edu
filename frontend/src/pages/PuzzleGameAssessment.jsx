import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PuzzleGame from '../components/PuzzleGame';

const PuzzleGameAssessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    const startAssessment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to take the assessment");
          setLoading(false);
          return;
        }

        // Start the assessment
        const response = await axios.post(
          "http://localhost:5001/api/assessments/start/puzzle-game",
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setAssessment(response.data.data.assessment);
          setPuzzle(response.data.data.puzzle);
        } else {
          setError("Failed to start assessment");
        }
      } catch (error) {
        console.error("Error starting assessment:", error);
        if (error.response?.status === 403) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(error.response?.data?.message || "Failed to start assessment");
        }
      } finally {
        setLoading(false);
      }
    };

    startAssessment();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F8] flex items-center justify-center">
        <div className="text-[#592538] text-xl">Loading...</div>
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

  return (
    <div className="min-h-screen bg-[#FDF8F8]">
      {puzzle && <PuzzleGame initialPuzzle={puzzle} assessmentId={assessment._id} />}
    </div>
  );
};

export default PuzzleGameAssessment; 