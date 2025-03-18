import React from 'react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <Link
          to="/appointments/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          New Appointment
        </Link>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">No appointments scheduled yet.</p>
        <p className="mt-2 text-gray-500">
          Create your first appointment to get started.
        </p>
      </div>
    </div>
  );
};

export default Appointments;
