import React from "react";
import { Link } from "react-router-dom";

const TeamMember = ({ name, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <h3 className="text-xl font-bold text-[#592538] mb-3">{name}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Abdallah Khaldoun Alhassan",
      description:
        "A driven IT student with a focus on leveraging technology to solve real-world problems, Abdallah contributed to the platform's design and AI-driven assessment features.",
    },
    {
      name: "Mohammed Abu Koush",
      description:
        "With a keen interest in user experience and system scalability, Mohammed played a key role in ensuring EduSoft is accessible, intuitive, and ready to support a growing user base.",
    },
    {
      name: "Osama Al-Taweel",
      description:
        "Osama brought his expertise in software development and gamification to create engaging, scenario-based challenges that make learning soft skills fun and effective.",
    },
    {
      name: "Mohialdeen Al-Kbaisi",
      description:
        "A problem-solver at heart, Mohialdeen focused on integrating advanced tools like 360-degree feedback and survey systems to provide comprehensive skill evaluations.",
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
              <h1 className="text-4xl font-bold mb-6">
                About Us: The Team Behind EduSoft
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Empowering IT students through innovative soft skills
                development
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-[#592538] mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              At EduSoft, we are dedicated to empowering IT students by bridging
              the gap between academic preparation and the professional demands
              of the modern IT industry. Our web-based platform is designed to
              assess and develop essential soft skills through innovative,
              technology-driven solutions.
            </p>
          </div>

          {/* Journey Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-[#592538] mb-6">
              Our Journey
            </h2>
            <p className="text-gray-600 mb-4">
              EduSoft was born as a Graduation Project (GP1) at the Faculty of
              Information Technology, Applied Science Private University (ASPU),
              in January 2025. This project is a testament to our commitment to
              innovation, education, and the success of IT students in a
              competitive global landscape.
            </p>
          </div>

          {/* Team Section */}
          <h2 className="text-3xl font-bold text-[#592538] mb-8">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>

          {/* Supervisor Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-[#592538] mb-6">
              Our Supervisor
            </h2>
            <p className="text-gray-600 mb-4">
              We are grateful for the guidance and expertise of our supervisor,{" "}
              <strong>Dr. Marwan Alakhras</strong>, a respected faculty member
              at ASPU's Faculty of Information Technology. His mentorship has
              inspired us to push the boundaries of innovation in soft skills
              development.
            </p>
          </div>

          {/* Institution Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-[#592538] mb-6">
              Our Institution
            </h2>
            <p className="text-gray-600 mb-4">
              EduSoft was developed at{" "}
              <strong>Applied Science Private University (ASPU)</strong>, a
              leading institution in Jordan known for its commitment to
              excellence in education and technology. We are proud to contribute
              to ASPU's mission of preparing students for successful careers in
              the ever-evolving field of IT.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#5B2333]">
            <p>
              © 2025 Applied Science Private University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
