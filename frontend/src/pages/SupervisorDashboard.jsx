import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [supervisorData, setSupervisorData] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is a supervisor
    const userType = localStorage.getItem('userType');
    const storedData = localStorage.getItem('userData');

    if (userType !== 'supervisor' || !storedData) {
      navigate('/login');
      return;
    }

    setSupervisorData(JSON.parse(storedData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  if (!supervisorData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Supervisor Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {supervisorData.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Supervisor Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add supervisor-specific features here */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Manage Users</h3>
                <p>View and manage user accounts</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Reports</h3>
                <p>View and generate reports</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Settings</h3>
                <p>Manage supervisor settings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard; 