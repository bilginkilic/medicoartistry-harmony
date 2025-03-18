
import { Calendar, Bell, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Patient Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/my-appointments"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">My Appointments</h3>
          </div>
          <p className="text-sm text-gray-600">View your upcoming appointments</p>
        </Link>

        <Link
          to="/notifications"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <p className="text-sm text-gray-600">Check appointment reminders</p>
        </Link>

        <Link
          to="/medical-history"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Medical History</h3>
          </div>
          <p className="text-sm text-gray-600">View your medical records</p>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
