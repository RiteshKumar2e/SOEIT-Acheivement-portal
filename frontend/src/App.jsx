import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import PublicPortfolioPage from './pages/public/PublicPortfolioPage';
import PublicPortfoliosPage from './pages/public/PublicPortfoliosPage';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import Support from './pages/public/Support';
import UserManual from './pages/public/UserManual';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAchievementsPage from './pages/student/MyAchievementsPage';
import UploadAchievementPage from './pages/student/UploadAchievementPage';
import ProfilePage from './pages/student/ProfilePage';
import MyCoursesPage from './pages/student/MyCoursesPage';
import StudentCoursesPage from './pages/admin/StudentCoursesPage';
import MyInternshipsPage from './pages/student/MyInternshipsPage';
import InternshipOpportunitiesPage from './pages/student/InternshipOpportunitiesPage';
import HackathonsPage from './pages/student/HackathonsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyAchievementsPage from './pages/admin/VerifyAchievementsPage';
import AllAchievementsPage from './pages/admin/AllAchievementsPage';
import StudentManagementPage from './pages/admin/StudentManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import FacultyManagementPage from './pages/admin/FacultyManagementPage';
import HackathonMonitoringPage from './pages/admin/HackathonMonitoringPage';
import StudentInternshipsPage from './pages/admin/StudentInternshipsPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ManagePostingsPage from './pages/faculty/ManagePostingsPage';

// Shared Pages
import EventsPage from './pages/shared/EventsPage';

// Features page (inline)
import FeaturesPage from './pages/public/FeaturesPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <ScrollToTopButton />
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

          {/* Auth Routes (redirect if logged in) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/admin-login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
