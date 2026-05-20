import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { homePathForRole } from "./config/roles.js";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { OrgAdminWorkspacePage } from "./pages/OrgAdminWorkspacePage.jsx";
import { TeamPage } from "./pages/TeamPage.jsx";
import { CounselorReviewsPage } from "./pages/CounselorReviewsPage.jsx";
import { CounselorMembersPage } from "./pages/CounselorMembersPage.jsx";
import { QuizInstructionsPage } from "./pages/QuizInstructionsPage.jsx";
import { QuizAttemptPage } from "./pages/QuizAttemptPage.jsx";
import { QuizResultPage } from "./pages/QuizResultPage.jsx";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-beige">
        <p className="text-ink/60 text-sm">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-beige">
        <p className="text-ink/60 text-sm">Loading…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}

function RootRedirect() {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-beige">
        <p className="text-ink/60 text-sm">Loading…</p>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={homePathForRole(user.role)} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/login"
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute roles={["user"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes/:quizId"
        element={
          <ProtectedRoute roles={["user"]}>
            <QuizInstructionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes/:quizId/attempt/:attemptId"
        element={
          <ProtectedRoute roles={["user"]}>
            <QuizAttemptPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:attemptId"
        element={
          <ProtectedRoute roles={["user"]}>
            <QuizResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspace"
        element={
          <ProtectedRoute roles={["org_admin"]}>
            <OrgAdminWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute roles={["org_admin"]}>
            <TeamPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews"
        element={
          <ProtectedRoute roles={["org_counselor", "org_admin"]}>
            <CounselorReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute roles={["org_counselor"]}>
            <CounselorMembersPage />
          </ProtectedRoute>
        }
      />

      <Route path="/welcome" element={<HomePage />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
