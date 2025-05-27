import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./pages/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AssessmentDetails from "./pages/AssessmentDetails";
import AssessmentQuiz from "./pages/AssessmentQuiz_leadership";
import LeadershipRecommendations from "./pages/LeadershipRecommendations";
import AboutUs from "./pages/AboutUs";
import Features from "./pages/Features";
import AssessmentsPage from "./pages/AssessmentsPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import ProblemSolvingAssessment from "./pages/ProblemSolvingAssessment";
import PuzzleGameAssessment from "./pages/PuzzleGameAssessment";
import CommunicationAssessment from "./pages/CommunicationAssessment";
import LanguageAssessment from "./pages/LanguageAssessment";
import SpeakingAssessmentReview from "./components/supervisor/SpeakingAssessmentReview";
import UserAssessments from "./pages/UserAssessments";
import CloudinaryTest from "./components/tests/CloudinaryTest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/assessment/:id" element={<AssessmentDetails />} />
        <Route path="/assessment/problem-solving" element={<ProblemSolvingAssessment />} />
        <Route path="/assessment/puzzle-game" element={<PuzzleGameAssessment />} />
        <Route path="/assessment/communication" element={<CommunicationAssessment />} />
        <Route path="/language-assessment" element={<LanguageAssessment />} />
        <Route
          path="/assessment/quiz/leadership"
          element={<AssessmentQuiz />}
        />
        <Route path="/assessment/leadership" element={<AssessmentQuiz />} />
        <Route
          path="/assessment/leadership/recommendations"
          element={<LeadershipRecommendations />}
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/my-assessments" element={<UserAssessments />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/cloudinary-test" element={<CloudinaryTest />} />
        <Route path="/supervisor/speaking-review" element={<SpeakingAssessmentReview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
