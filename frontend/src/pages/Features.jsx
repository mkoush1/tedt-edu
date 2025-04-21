import React from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-[#592538]/10 rounded-lg flex items-center justify-center mb-4">
      <span className="text-[#592538] text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-[#592538] mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      title: "AI-Powered Assessments",
      description:
        "Get precise evaluations of your soft skills through AI-driven analysis of speech, video, and written submissions.",
      icon: "🤖",
    },
    {
      title: "Gamified Learning",
      description:
        "Engage with interactive challenges and scenario-based games to develop your skills while having fun.",
      icon: "🎮",
    },
    {
      title: "Comprehensive Surveys",
      description:
        "Evaluate your competencies through structured surveys with detailed insights and progress tracking.",
      icon: "📊",
    },
    {
      title: "Real-World Scenarios",
      description:
        "Practice with simulated workplace situations to prepare for real industry challenges.",
      icon: "🌐",
    },
    {
      title: "Real-Time Feedback",
      description:
        "Receive immediate, actionable feedback to guide your improvement journey.",
      icon: "⚡",
    },
    {
      title: "360° Feedback",
      description:
        "Get comprehensive evaluations from peers and experts for better collaboration skills.",
      icon: "🔄",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your development with intuitive dashboards and performance analytics.",
      icon: "📈",
    },
    {
      title: "Accessible Platform",
      description:
        "Access your learning journey securely from any device, anywhere, anytime.",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-[#592538]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="/eduSoft_logo.png"
                  alt="EduSoft Logo"
                  className="h-12 w-auto"
                />
              </Link>
              <Link to="/">
                <img
                  src="/logo-02.png"
                  alt="asu Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-[#F7F4F3] hover:text-gray-200 px-3 py-2 text-lg font-medium"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-[#F7F4F3] hover:text-gray-200 px-3 py-2 text-lg font-medium"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-[#F7F4F3] hover:text-gray-200 px-3 py-2 text-lg font-medium"
              >
                About us
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-2 text-base font-medium rounded-md text-[#5B2333] bg-white hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-6 py-2 text-base font-medium rounded-md text-[#5B2333] bg-white hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <div className="bg-[#592538] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Features of EduSoft</h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Empowering IT Students with Cutting-Edge Tools for Soft Skills
                Development
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-[#592538] mb-6">
              Why Choose EduSoft?
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                At EduSoft, we're revolutionizing the way IT students develop
                essential soft skills through our technology-driven, interactive
                platform. Our features are designed to provide comprehensive
                assessments, actionable insights, and engaging learning
                experiences tailored to the demands of the modern IT industry.
              </p>
              <p className="mb-4">
                We align our assessments with IT course objectives to ensure
                relevance and value within your academic journey. Our platform
                supports integration with Learning Management Systems (LMS),
                making it easy for academic supervisors and career advisors to
                track your progress.
              </p>
            </div>

            {/* CTA Section */}
            <div className="mt-8 text-center">
              <Link
                to="/signup"
                className="inline-block px-8 py-3 bg-[#592538] text-white rounded-lg font-medium hover:bg-[#6d2c44] transition-colors"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} EduSoft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
