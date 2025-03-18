import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to MedicoArtistry Harmony dashboard.</p>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-800">Appointments</h2>
          <p className="mt-2 text-indigo-600">0 upcoming appointments</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-green-800">Patients</h2>
          <p className="mt-2 text-green-600">0 registered patients</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-yellow-800">Reports</h2>
          <p className="mt-2 text-yellow-600">0 recent reports</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
