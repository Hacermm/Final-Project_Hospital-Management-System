import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Departments from './pages/Departments.jsx'
import ManageDepartments from './pages/admin/ManageDepartments.jsx'
import ManageDoctors from './pages/admin/ManageDoctors.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/patient" element={
          <ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/departments" element={<Departments />} />
        <Route path="/admin/super" element={
          <ProtectedRoute allowedRole="super_admin"><SuperAdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/departments" element={
        <ProtectedRoute allowedRole="admin"><ManageDepartments /></ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
       <ProtectedRoute allowedRole="admin"><ManageDoctors /></ProtectedRoute>
        } />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)