import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import CookieConsent from './components/common/CookieConsent';

// Loading Component
const PageLoader = () => null;

// Public Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const PublicPortfolioPage = lazy(() => import('./pages/public/PublicPortfolioPage'));
const PublicPortfoliosPage = lazy(() => import('./pages/public/PublicPortfoliosPage'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/public/TermsOfService'));
const Support = lazy(() => import('./pages/public/Support'));
const UserManual = lazy(() => import('./pages/public/UserManual'));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage'));
const Accessibility = lazy(() => import('./pages/public/Accessibility'));
const PrivacyPreferences = lazy(() => import('./pages/public/PrivacyPreferences'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/auth/AdminLoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const MyAchievementsPage = lazy(() => import('./pages/student/MyAchievementsPage'));
const UploadAchievementPage = lazy(() => import('./pages/student/UploadAchievementPage'));
const ProfilePage = lazy(() => import('./pages/student/ProfilePage'));
const MyCoursesPage = lazy(() => import('./pages/student/MyCoursesPage'));
const StudentCoursesPage = lazy(() => import('./pages/admin/StudentCoursesPage'));
const MyInternshipsPage = lazy(() => import('./pages/student/MyInternshipsPage'));
const InternshipOpportunitiesPage = lazy(() => import('./pages/student/InternshipOpportunitiesPage'));
const HackathonsPage = lazy(() => import('./pages/student/HackathonsPage'));
const MyProjectsPage = lazy(() => import('./pages/student/MyProjectsPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const VerifyAchievementsPage = lazy(() => import('./pages/admin/VerifyAchievementsPage'));
const AllAchievementsPage = lazy(() => import('./pages/admin/AllAchievementsPage'));
const StudentManagementPage = lazy(() => import('./pages/admin/StudentManagementPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const FacultyManagementPage = lazy(() => import('./pages/admin/FacultyManagementPage'));
const HackathonMonitoringPage = lazy(() => import('./pages/admin/HackathonMonitoringPage'));
const StudentInternshipsPage = lazy(() => import('./pages/admin/StudentInternshipsPage'));
const StudentProjectsPage = lazy(() => import('./pages/admin/StudentProjectsPage'));

// Faculty Pages
const FacultyDashboard = lazy(() => import('./pages/faculty/FacultyDashboard'));
const ManagePostingsPage = lazy(() => import('./pages/faculty/ManagePostingsPage'));

// Shared Pages
const EventsPage = lazy(() => import('./pages/shared/EventsPage'));

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <ScrollToTopButton />
      <CookieConsent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />
          <Route path="/public-portfolio" element={<PublicPortfoliosPage />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />
          <Route path="/manual" element={<UserManual />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/privacy-preferences" element={<PrivacyPreferences />} />
          <Route path="/cookies" element={<PrivacyPreferences />} />

          {/* Auth Routes (redirect if logged in) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/admin-login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          {/* Shared Authenticated Routes (All Roles) */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'faculty']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/events" element={<EventsPage />} />
          </Route>

          {/* Student Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/achievements" element={<MyAchievementsPage />} />
            <Route path="/achievements/upload" element={<UploadAchievementPage />} />
            <Route path="/achievements/edit/:id" element={<UploadAchievementPage />} />
            <Route path="/courses" element={<MyCoursesPage />} />
            <Route path="/internships" element={<MyInternshipsPage />} />
            <Route path="/internship-opportunities" element={<InternshipOpportunitiesPage />} />
            <Route path="/hackathons" element={<HackathonsPage />} />
            <Route path="/projects" element={<MyProjectsPage />} />
          </Route>

          {/* Admin / Faculty Shared Management Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'faculty']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/admin/verify" element={<VerifyAchievementsPage />} />
            <Route path="/admin/achievements" element={<AllAchievementsPage />} />
            <Route path="/admin/students" element={<StudentManagementPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/courses" element={<StudentCoursesPage />} />
            <Route path="/admin/internships" element={<StudentInternshipsPage />} />
            <Route path="/admin/projects" element={<StudentProjectsPage />} />
            <Route path="/faculty/projects" element={<StudentProjectsPage />} />
            <Route path="/admin/manage-internships" element={<ManagePostingsPage />} />
            <Route path="/faculty/manage-internships" element={<ManagePostingsPage />} />
            <Route path="/admin/hackathons" element={<HackathonMonitoringPage />} />
          </Route>

          {/* Admin Exclusive Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/faculty" element={<FacultyManagementPage />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: '1rem' }}>
              <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
              <h2 style={{ color: 'var(--text-secondary)' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
