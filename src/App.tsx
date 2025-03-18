
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard';
import AuthGuard from './components/AuthGuard';
import Appointments from './pages/appointments';
import NewAppointment from './pages/appointments/new';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<NewAppointment />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
