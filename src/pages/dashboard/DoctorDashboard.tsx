
import { Calendar, ClipboardList, Users } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/appointments"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">My Appointments</h3>
          </div>
          <p className="text-sm text-gray-600">View and manage your appointments</p>
        </Link>

        <Link
          to="/procedures"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Procedures</h3>
          </div>
          <p className="text-sm text-gray-600">Track and update patient procedures</p>
        </Link>

        <Link
          to="/patients"
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow space-y-2"
        >
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Patient List</h3>
          </div>
          <p className="text-sm text-gray-600">View your patient records</p>
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;
