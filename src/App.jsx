import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useOutletContext } from "react-router-dom";
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
import { WellnessHubPage } from "./pages/WellnessHubPage.jsx";
import { AppShell } from "./components/AppShell.jsx";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const context = useOutletContext();

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

  return children ? children : <Outlet context={context} />;
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

      {/* App Layout wrapping all protected workspace screens */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* User-only Screens */}
        <Route element={<ProtectedRoute roles={["user"]} />}>
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/wellness-hub" element={<WellnessHubPage />} />
          <Route path="/quizzes/:quizId" element={<QuizInstructionsPage />} />
          <Route path="/quizzes/:quizId/attempt/:attemptId" element={<QuizAttemptPage />} />
          <Route path="/results/:attemptId" element={<QuizResultPage />} />
        </Route>

        {/* Org Admin-only Screens */}
        <Route element={<ProtectedRoute roles={["org_admin"]} />}>
          <Route path="/workspace" element={<OrgAdminWorkspacePage />} />
          <Route path="/team" element={<TeamPage />} />
        </Route>

        {/* Shared Org Admin & Counselor Screens */}
        <Route element={<ProtectedRoute roles={["org_admin", "org_counselor"]} />}>
          <Route path="/reviews" element={<CounselorReviewsPage />} />
        </Route>

        {/* Counselor-only Screens */}
        <Route element={<ProtectedRoute roles={["org_counselor"]} />}>
          <Route path="/members" element={<CounselorMembersPage />} />
        </Route>
      </Route>

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
