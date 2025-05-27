import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PuzzleGame = ({ initialPuzzle, assessmentId }) => {
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState(initialPuzzle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const TIME_LIMIT = 4 * 60; // 4 minutes in seconds

  useEffect(() => {
    startTimer();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  // Check time limit
  useEffect(() => {
    if (timer >= TIME_LIMIT && !puzzle?.isCompleted) {
      clearInterval(timerInterval);
      submitAssessment(puzzle);
    }
  }, [timer, puzzle]);

  // Update valid moves whenever puzzle state changes
  useEffect(() => {
    if (!puzzle) return;

    const currentState = puzzle.currentState;
    const size = puzzle.size;
    let emptyRow, emptyCol;
    const newValidMoves = [];

    // Find empty cell (0)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (currentState[i][j] === 0) {
          emptyRow = i;
          emptyCol = j;
          break;
        }
      }
    }

    // Find valid moves (adjacent to empty cell)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Math.abs(i - emptyRow) + Math.abs(j - emptyCol) === 1) {
          newValidMoves.push(`${i},${j}`);
        }
      }
    }

    setValidMoves(newValidMoves);
  }, [puzzle]);

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimer(0);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const makeMove = async (row, col) => {
    if (!puzzle || puzzle.isCompleted) return;
    
    // Don't allow clicking on the empty cell
    if (puzzle.currentState[row][col] === 0) {
      console.log('Clicked on empty cell');
      return;
    }

    // Check if move is valid
    if (!validMoves.includes(`${row},${col}`)) {
      // Instead of showing error, just ignore invalid moves
      console.log('Invalid move ignored');
      return;
    }

    console.log('Attempting move:', { row, col });
    console.log('Current puzzle state:', puzzle.currentState);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5001/api/puzzle/${puzzle._id}/move`,
        { row, col },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Move successful:', response.data);
      setPuzzle(response.data);
      setError(null);

      if (response.data.isCompleted) {
        clearInterval(timerInterval);
        await submitAssessment(response.data);
      }
    } catch (error) {
      console.error('Error making move:', error);
      // Don't show error message for invalid moves
      if (error.response?.status !== 400) {
        setError(error.response?.data?.message || 'Failed to make move');
      }
    }
  };

  const submitAssessment = async (completedPuzzle) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5001/api/assessments/submit/puzzle-game',
        {
          puzzleData: [{
            puzzleId: completedPuzzle._id,
            difficulty: 'medium',
            moves: completedPuzzle.moves,
            timeTaken: timer,
            completed: true
          }]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Update local storage with the new assessment status
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData) {
          userData.completedAssessments = response.data.result.assessmentStatus.completedAssessments;
          userData.totalAssessmentsCompleted = response.data.result.assessmentStatus.totalCompleted;
          userData.progress = response.data.result.assessmentStatus.progress;
          localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Update puzzle state with score and rating
        setPuzzle(prev => ({
          ...prev,
          isCompleted: true,
          score: response.data.result.score,
          rating: response.data.result.rating,
          completionTime: response.data.result.completionTime
        }));

        // Show success message
        setError(null);
      } else {
        setError('Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError(error.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!puzzle || puzzle.isCompleted) return;

    const currentState = puzzle.currentState;
    const size = puzzle.size;
    let emptyRow, emptyCol;

    // Find empty cell (0)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (currentState[i][j] === 0) {
          emptyRow = i;
          emptyCol = j;
          break;
        }
      }
    }

    switch (e.key) {
      case 'ArrowUp':
        if (emptyRow < size - 1) makeMove(emptyRow + 1, emptyCol);
        break;
      case 'ArrowDown':
        if (emptyRow > 0) makeMove(emptyRow - 1, emptyCol);
        break;
      case 'ArrowLeft':
        if (emptyCol < size - 1) makeMove(emptyRow, emptyCol + 1);
        break;
      case 'ArrowRight':
        if (emptyCol > 0) makeMove(emptyRow, emptyCol - 1);
        break;
      default:
        break;
    }
  }, [puzzle]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-800">Submitting assessment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Slide Puzzle</h1>
          <div className="text-gray-600">
            <div>Moves: {puzzle?.moves}</div>
            <div className={`${timer >= TIME_LIMIT - 30 ? 'text-red-500' : ''}`}>
              Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500">
              Time Limit: 4:00
            </div>
          </div>
        </div>

        {/* Only show non-validation errors */}
        {error && !error.includes('Invalid move') && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg">
          {puzzle?.currentState.map((row, i) => (
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg
                  ${cell === 0 ? 'bg-transparent' : 'bg-white hover:bg-gray-100'}
                  ${validMoves.includes(`${i},${j}`) ? 'ring-2 ring-blue-500' : ''}
                  ${puzzle.isCompleted || timer >= TIME_LIMIT ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => !puzzle.isCompleted && timer < TIME_LIMIT && makeMove(i, j)}
                disabled={cell === 0 || puzzle.isCompleted || timer >= TIME_LIMIT}
              >
                {cell !== 0 && cell}
              </button>
            ))
          ))}
        </div>

        {puzzle?.isCompleted && (
          <div className="mt-6 text-center">
            {puzzle.score === 100 ? (
              <div className="mb-6">
                <div className="text-3xl font-bold text-yellow-500 mb-4">🎉 Congratulations! 🎉</div>
                <div className="text-xl text-green-600 mb-2">You achieved a perfect score!</div>
                <div className="text-gray-600 mb-4">You're a puzzle master!</div>
              </div>
            ) : (
              <p className="text-xl font-bold text-green-600 mb-4">
                You can do better!
              </p>
            )}
            <p className="text-gray-600 mb-4">
              Moves: {puzzle.moves} | Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-gray-600 mb-4">
              Score: {puzzle.score || 'Calculating...'}
            </p>
            <p className="text-gray-600 mb-4">
              Rating: {puzzle.rating || 'Calculating...'}
            </p>
            <p className="text-gray-600 mb-4">
              Completion Time: {puzzle.completionTime || (timer / 60).toFixed(2)} minutes
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/assessment/recommendations')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Recommendations
              </button>
            </div>
          </div>
        )}

        {timer >= TIME_LIMIT && !puzzle?.isCompleted && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-red-600 mb-4">
              Time's Up!
            </p>
            <p className="text-gray-600 mb-4">
              You've reached the 4-minute time limit.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/assessment/recommendations')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Results
              </button>
            </div>
          </div>
        )}

        {!puzzle?.isCompleted && timer < TIME_LIMIT && (
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame; 