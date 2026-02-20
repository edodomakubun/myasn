import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

import AdminSettings from './pages/admin/Settings';
import AdminUsers from './pages/admin/Users';
import Profile from './pages/Profile';
import Education from './pages/Education';
import Rank from './pages/Rank';
import Salary from './pages/Salary';
import Certification from './pages/Certification';
import Family from './pages/Family';
import Documents from './pages/Documents';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/education" element={<Education />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/family" element={<Family />} />
          <Route path="/documents" element={<Documents />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
