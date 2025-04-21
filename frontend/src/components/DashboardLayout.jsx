import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [loading, setLoading] = React.useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("userData");
      navigate("/login");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📊</span>
              <h1 className="text-2xl font-semibold text-[#592538]">{title}</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {userData.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#592538] text-white rounded-lg hover:bg-[#6d2c44] transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
