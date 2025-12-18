import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDataContext } from "./state/DataContext";
import { useAuth } from "./state/AuthContext";

function NavBar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="nav">
      <div className="nav__brand">Museum Exec Dashboard</div>
      <nav className="nav__links">
        {user ? (
          <>
            <Link className={location.pathname === "/upload" ? "active" : ""} to="/upload">
              Upload
            </Link>
            <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">
              Dashboard
            </Link>
            <Link className={location.pathname === "/profile" ? "active" : ""} to="/profile">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link className={location.pathname === "/login" ? "active" : ""} to="/login">
              Login
            </Link>
            <Link className={location.pathname === "/signup" ? "active" : ""} to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="empty">
      <h2>Welcome</h2>
      <p>Upload the current expense and gifts spreadsheets to view the dashboard.</p>
      <Link className="btn" to="/upload">
        Go to upload
      </Link>
    </div>
  );
}

export default function App() {
  const { dataReady } = useDataContext();
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <EmptyState />
              )
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {dataReady ? <DashboardPage /> : <Navigate to="/upload" replace />}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

