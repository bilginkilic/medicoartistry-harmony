import React from 'react';
import { Link } from 'react-router-dom';

const NewAppointment = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Appointment</h1>
        <Link
          to="/appointments"
          className="text-indigo-600 hover:text-indigo-900"
        >
          Back to appointments
        </Link>
      </div>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Appointment Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="initial">Initial Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="procedure">Procedure</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            name="time"
            id="time"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason for Visit
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Please describe your reason for scheduling this appointment"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Schedule Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAppointment;
