import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F8]">
      {/* Navbar */}
      <header className="bg-[#592538]">
        <nav className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img
                  src="/eduSoft_logo.png"
                  alt="EduSoft Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <Link to="/">
                <img
                  src="/logo-02.png"
                  alt="ASPU Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-12">
              <Link to="/" className="text-white text-xl font-normal">
                Home
              </Link>
              <Link to="/features" className="text-white text-xl font-normal">
                Features
              </Link>
              <Link to="/about" className="text-white text-xl font-normal">
                About us
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-1.5 text-base font-medium rounded-lg bg-white text-[#592538] hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-1.5 text-base font-medium rounded-lg bg-white text-[#592538] hover:bg-gray-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-8 lg:px-12">
        <div className="max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div className="space-y-8 pt-12">
              <div className="space-y-6">
                <h1 className="text-[#592538] text-6xl font-bold leading-tight">
                  Welcome to EduSoft
                </h1>
                <h2 className="text-[#592538] text-5xl font-bold leading-tight">
                  Your Personal Soft Skills Development Hub!
                </h2>
              </div>
              <p className="text-[#592538] text-xl leading-relaxed">
                At EduSoft, we are committed to empowering IT students with
                essential soft skills that are crucial for success in the modern
                workforce. Our platform offers a comprehensive,
                technology-driven approach to assessing and improving your
                communication, teamwork, leadership, problem-solving, and other
                core competencies.
              </p>
              <div>
                <Link
                  to="/signup"
                  className="inline-block px-10 py-4 text-xl font-medium rounded-2xl bg-[#592538] text-white hover:bg-[#6d2c44] transition duration-300"
                >
                  Let's Get Started!
                </Link>
              </div>
            </div>

            {/* Right Images */}
            <div className="grid grid-cols-12 gap-4 pt-8">
              <div className="col-span-7 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/studying.png"
                    alt="Student studying"
                    className="w-full h-[280px] object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/professional-woman.png"
                    alt="Professional woman"
                    className="w-full h-[280px] object-cover"
                  />
                </div>
              </div>
              <div className="col-span-5">
                <div className="rounded-2xl overflow-hidden shadow-lg h-[580px]">
                  <img
                    src="/graduate.png"
                    alt="Graduate"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[#592538]">
            © {new Date().getFullYear()} EduSoft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
