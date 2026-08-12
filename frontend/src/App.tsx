import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ApplyJobPage from './pages/ApplyJobPage';
import ApplicationSuccessPage from './pages/ApplicationSuccessPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import InterviewDetailsPage from './pages/InterviewDetailsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import CompaniesPage from './pages/CompaniesPage';
import ContactPage from './pages/ContactPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Candidate Routes */}
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute>
                  <ApplyJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/application-success"
              element={
                <ProtectedRoute>
                  <ApplicationSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/skills"
              element={<Navigate to="/profile" replace />}
            />
            <Route
              path="/profile/resume"
              element={<Navigate to="/profile" replace />}
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <MyApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/:id"
              element={
                <ProtectedRoute>
                  <InterviewDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin & Recruiter Applications Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute recruiterOrAdmin>
                  <AdminApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
