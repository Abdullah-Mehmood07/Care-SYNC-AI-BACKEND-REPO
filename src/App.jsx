import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';

import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';

import PADashboard from './pages/PADashboard';
import LabDashboard from './pages/LabDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyPublic from './pages/EmergencyPublic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="login" element={<Login />} />
          <Route path="patient-dashboard" element={<PatientDashboard />} />
          <Route path="pa-dashboard" element={<PADashboard />} />
          <Route path="lab-dashboard" element={<LabDashboard />} />
          <Route path="hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="emergency-public" element={<EmergencyPublic />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
