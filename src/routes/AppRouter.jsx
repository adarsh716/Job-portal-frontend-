import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import DashboardLayout from '../components/layout/DashboardLayout'

import LandingPage from '../pages/public/LandingPage'
import JobListingsPage from '../pages/public/JobListingsPage'
import JobDetailPage from '../pages/public/JobDetailPage'
import CompanyProfilePage from '../pages/public/CompanyProfilePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'

import SeekerDashboard from '../pages/seeker/SeekerDashboard'
import ProfilePage from '../pages/seeker/ProfilePage'
import MyApplicationsPage from '../pages/seeker/MyApplicationsPage'
import SavedJobsPage from '../pages/seeker/SavedJobsPage'

import EmployerDashboard from '../pages/employer/EmployerDashboard'
import CompanySetupPage from '../pages/employer/CompanySetupPage'
import ManageJobsPage from '../pages/employer/ManageJobsPage'
import PostJobPage from '../pages/employer/PostJobPage'
import ApplicantsPage from '../pages/employer/ApplicantsPage'

import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsersPage from '../pages/admin/ManageUsersPage'
import ManageCompaniesPage from '../pages/admin/ManageCompaniesPage'
import ManageJobsAdminPage from '../pages/admin/ManageJobsAdminPage'

function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no layout wrapper */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Public pages — Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobListingsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies/:id" element={<CompanyProfilePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Seeker dashboard — sidebar layout */}
        <Route element={<ProtectedRoute allowedRoles={['JOB_SEEKER']} />}>
          <Route element={<><Navbar /><DashboardLayout /></>}>
            <Route path="/dashboard" element={<SeekerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/saved-jobs" element={<SavedJobsPage />} />
          </Route>
        </Route>

        {/* Employer dashboard — sidebar layout */}
        <Route element={<ProtectedRoute allowedRoles={['EMPLOYER']} />}>
          <Route element={<><Navbar /><DashboardLayout /></>}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/company" element={<CompanySetupPage />} />
            <Route path="/employer/jobs" element={<ManageJobsPage />} />
            <Route path="/employer/jobs/new" element={<PostJobPage />} />
            <Route path="/employer/jobs/:id/edit" element={<PostJobPage />} />
            <Route path="/employer/jobs/:id/applicants" element={<ApplicantsPage />} />
          </Route>
        </Route>

        {/* Admin dashboard — sidebar layout */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<><Navbar /><DashboardLayout /></>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/companies" element={<ManageCompaniesPage />} />
            <Route path="/admin/jobs" element={<ManageJobsAdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
