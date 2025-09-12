import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./stores/auth.store.js";
import Navbar from "./pages/Navbar.jsx";

const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.jsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const AddUserByAdmin = lazy(() => import("./components/AddUserByAdmin.jsx"));
const AddStoreByAdmin = lazy(() => import("./components/AddStoreByAdmin.jsx"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent mx-auto" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const DashboardRouter = () => {
  const user = useAuth((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "store_owner") return <OwnerDashboard />;
  return <UserDashboard />;
};

const AdminPage = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const UserPage = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicPage = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/signup" element={<PublicPage><SignupPage /></PublicPage>} />
            <Route path="/login" element={<PublicPage><LoginPage /></PublicPage>} />
            <Route path="/" element={<DashboardRouter />} />
            <Route path="/admin/dashboard" element={<AdminPage><AdminDashboard /></AdminPage>} />
            <Route path="/admin/create-user" element={<AdminPage><AddUserByAdmin /></AdminPage>} />
            <Route path="/admin/create-store" element={<AdminPage><AddStoreByAdmin /></AdminPage>} />
            <Route path="/profile" element={<UserPage><ProfilePage /></UserPage>} />
            <Route path="/test" element={<AddStoreByAdmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}
