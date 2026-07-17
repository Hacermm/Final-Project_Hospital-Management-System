import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Departments from './pages/Departments.jsx'
import Doctors from './pages/Doctors.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx'
import ManageDepartments from './pages/admin/ManageDepartments.jsx'
import ManageDoctors from './pages/admin/ManageDoctors.jsx'
import ManagePatients from './pages/admin/ManagePatients.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BookAppointment from './pages/patient/BookAppointment.jsx'
import MyAppointments from './pages/patient/MyAppointments.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorSchedule from './pages/doctor/DoctorSchedule.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
     
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/doctors" element={<Doctors />} />

       
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
        <Route path="/admin/super" element={
          <ProtectedRoute allowedRole="super_admin"><SuperAdminDashboard /></ProtectedRoute>
        } />

      
        <Route path="/admin/departments" element={
          <ProtectedRoute allowedRole="admin"><ManageDepartments /></ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRole="admin"><ManageDoctors /></ProtectedRoute>
        } />
        <Route path="/admin/patients" element={
          <ProtectedRoute allowedRole="admin"><ManagePatients /></ProtectedRoute>
        } />
        <Route path="/patient/book" element={
          <ProtectedRoute allowedRole="patient"><BookAppointment /></ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute allowedRole="patient"><MyAppointments /></ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRole="doctor"><DoctorAppointments /></ProtectedRoute>
        } />
        <Route path="/doctor/schedule" element={
          <ProtectedRoute allowedRole="doctor"><DoctorSchedule /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)