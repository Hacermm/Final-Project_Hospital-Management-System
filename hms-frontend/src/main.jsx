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
import PatientLayout from './layouts/PatientLayout.jsx'
import DoctorLayout from './layouts/DoctorLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
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
import Analytics from './pages/admin/Analytics.jsx'
import ManageAdmins from './pages/admin/ManageAdmins.jsx'
import ContactMessages from './pages/admin/ContactMessages.jsx'

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

          <Route element={<ProtectedRoute allowedRole="patient"><PatientLayout /></ProtectedRoute>}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/book" element={<BookAppointment />} />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route path="/patient/history" element={<MedicalHistory />} />
            <Route path="/patient/lab-tests" element={<MyLabTests />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="doctor"><DoctorLayout /></ProtectedRoute>}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/doctor/records/new" element={<WriteMedicalRecord />} />
            <Route path="/doctor/lab-tests" element={<UploadLabTest />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<ManageDepartments />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/patients" element={<ManagePatients />} />
            <Route path="/admin/messages" element={<ContactMessages />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="super_admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/super" element={<SuperAdminDashboard />} />
            <Route path="/admin/admins" element={<ManageAdmins />} />
          </Route>

          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/ai" element={<AiAssistant />
          } />
        </Routes>
        <AiWidget />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)