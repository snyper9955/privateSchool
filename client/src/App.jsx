import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';

// Layouts and components that should be loaded immediately
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Students = lazy(() => import('./pages/Students'));
const Courses = lazy(() => import('./pages/Courses'));
const Inquiries = lazy(() => import('./pages/Inquiries'));
const Payments = lazy(() => import('./pages/Payments'));
const Notices = lazy(() => import('./pages/Notices'));
const Toppers = lazy(() => import('./pages/Toppers'));
const Home = lazy(() => import('./pages/Home'));
const PublicCourses = lazy(() => import('./pages/PublicCourses'));
const PublicNotices = lazy(() => import('./pages/PublicNotices'));
const PublicToppers = lazy(() => import('./pages/PublicToppers'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const Gallery = lazy(() => import('./pages/Gallery'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const CourseContent = lazy(() => import('./pages/student/CourseContent'));
const FAQ = lazy(() => import('./pages/FAQ'));

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-700">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-slate-100"></div>
      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
    </div>
    <p className="mt-4 text-slate-500 font-medium animate-pulse text-sm">Preparing Mourya Accadmy Darbhanga everything...</p>
  </div>
);

const FullPageLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 animate-in fade-in duration-500">
    <div className="relative">
      <div className="h-20 w-20 rounded-full border-4 border-white shadow-sm"></div>
      <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
    </div>
    <div className="mt-6 flex flex-col items-center gap-1">
      <span className="text-xl font-bold text-slate-900 tracking-tight">Mourya Accadmy Darbhanga</span>
      <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Initializing Education Portal</span>
    </div>
  </div>
);

const DashboardWrapper = ({ children }) => (
  <div className="pt-24 min-h-screen bg-slate-50/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {children}
    </div>
  </div>
);

const AppContent = () => {
  const { loading, user } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Scroll to top instantly on every route map redirect
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return <FullPageLoading />;
  }

  return (
    <ApiProvider>
      <SocketProvider>
        <Toaster />
        {!['/login', '/register', '/forgot-password', '/reset-password'].some(path => location.pathname.startsWith(path)) && <Header />}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
          <Route path="/reset-password/:token" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/notices" element={<PublicNotices />} />
          <Route path="/toppers" element={<PublicToppers />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Authenticated Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><DashboardWrapper><Dashboard /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><DashboardWrapper><Students /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><DashboardWrapper><Courses /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><DashboardWrapper><Inquiries /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute><DashboardWrapper><Payments /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/notices" element={<ProtectedRoute><DashboardWrapper><Notices /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/toppers" element={<ProtectedRoute><DashboardWrapper><Toppers /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><DashboardWrapper><Profile /></DashboardWrapper></ProtectedRoute>} />

          {/* Authenticated Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute><DashboardWrapper><StudentDashboard /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><DashboardWrapper><Profile /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/student/course/:courseId/learn" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
          {/* These pages could be implemented as student-specific views later */}
          <Route path="/student/courses" element={<ProtectedRoute><DashboardWrapper><Courses /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/student/notices" element={<ProtectedRoute><DashboardWrapper><Notices /></DashboardWrapper></ProtectedRoute>} />
          <Route path="/student/payments" element={<ProtectedRoute><DashboardWrapper><Payments /></DashboardWrapper></ProtectedRoute>} />

          {/* Role-based Redirect for /landing or authenticated users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student/dashboard" />}
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        {!['/login', '/register', '/forgot-password', '/reset-password'].some(path => location.pathname.startsWith(path)) && <Footer />}
      </SocketProvider>
    </ApiProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
