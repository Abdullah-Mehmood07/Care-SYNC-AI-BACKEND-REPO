import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';

import PALogin from './pages/PALogin';
import PADashboard from './pages/PADashboard';
import LabLogin from './pages/LabLogin';
import LabDashboard from './pages/LabDashboard';
import HospitalLogin from './pages/HospitalLogin';
import HospitalDashboard from './pages/HospitalDashboard';
import WebAdminLogin from './pages/WebAdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyPublic from './pages/EmergencyPublic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="patient-login" element={<PatientLogin />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="pa-login" element={<PALogin />} />
          <Route path="pa-dashboard" element={<PADashboard />} />
          <Route path="lab-login" element={<LabLogin />} />
          <Route path="lab-dashboard" element={<LabDashboard />} />
          <Route path="hospital-login" element={<HospitalLogin />} />
          <Route path="hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="web-admin" element={<WebAdminLogin />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="emergency-public" element={<EmergencyPublic />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
