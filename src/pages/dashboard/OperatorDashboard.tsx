
import { Calendar, UserPlus, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const OperatorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Operator Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/register-visitor"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Register Visitor</h3>
          </div>
          <p className="text-sm text-gray-600">Add new visitors to the system</p>
        </Link>

        <Link
          to="/appointments/new"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Schedule Appointment</h3>
          </div>
          <p className="text-sm text-gray-600">Create appointments for patients</p>
        </Link>

        <Link
          to="/procedures/manage"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Manage Procedures</h3>
          </div>
          <p className="text-sm text-gray-600">Update procedure records</p>
        </Link>
      </div>
    </div>
  );
};

export default OperatorDashboard;
