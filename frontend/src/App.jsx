import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import Layout from "./components/layout/Layout";
import LandingPage from "./features/landing/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProblemsPage from "./features/problems/pages/ProblemsPage";
import ProblemWorkspace from "./features/problems/pages/ProblemWorkspace";
import ProblemFormStepper from "./features/problems/pages/ProblemFormStepper";

// Guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard for admin-only pages
const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/problems" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App Workspace Pages inside AppShell Layout */}
      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <Layout>
              <ProblemsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/problems/create"
        element={
          <AdminRoute>
            <Layout>
              <ProblemFormStepper mode="create" />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/problems/:id/edit"
        element={
          <AdminRoute>
            <Layout>
              <ProblemFormStepper mode="edit" />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/problems/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProblemWorkspace />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect all unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
