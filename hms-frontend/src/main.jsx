import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Departments from './pages/Departments.jsx'
import Doctors from './pages/Doctors.jsx'
import DoctorDetail from './pages/DoctorDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
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
import WriteMedicalRecord from './pages/doctor/WriteMedicalRecord.jsx'
import MedicalHistory from './pages/patient/MedicalHistory.jsx'
import UploadLabTest from './pages/doctor/UploadLabTest.jsx'
import MyLabTests from './pages/patient/MyLabTests.jsx'
import Chat from './pages/Chat.jsx'
import AiAssistant from './pages/AiAssistant.jsx'
import AiWidget from './components/AiWidget.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

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
          <Route path="/doctor/records/new" element={
            <ProtectedRoute allowedRole="doctor"><WriteMedicalRecord /></ProtectedRoute>
          } />
          <Route path="/patient/history" element={
            <ProtectedRoute allowedRole="patient"><MedicalHistory /></ProtectedRoute>
          } />
          <Route path="/doctor/lab-tests" element={
            <ProtectedRoute allowedRole="doctor"><UploadLabTest /></ProtectedRoute>
          } />
          <Route path="/patient/lab-tests" element={
            <ProtectedRoute allowedRole="patient"><MyLabTests /></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/ai" element={<AiAssistant />} />
        </Routes>
        <AiWidget />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)