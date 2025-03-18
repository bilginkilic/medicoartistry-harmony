
import { useAuth } from "../../hooks/useAuth";
import DoctorDashboard from "./DoctorDashboard";
import OperatorDashboard from "./OperatorDashboard";
import PatientDashboard from "./PatientDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardsByRole: Record<string, JSX.Element> = {
    doctor: <DoctorDashboard />,
    operator: <OperatorDashboard />,
    patient: <PatientDashboard />,
    visitor: <PatientDashboard /> // Visitors see the patient dashboard after registration
  };

  return (
    <div className="container mx-auto p-6">
      {dashboardsByRole[user.role] || <PatientDashboard />}
    </div>
  );
};

export default Dashboard;
