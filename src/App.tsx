import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useDataContext } from "./state/DataContext";
import { useAuth } from "./state/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="nav">
      <div className="nav__brand">Museum Exec Dashboard</div>
      <nav className="nav__links">
        <Link className={location.pathname === "/upload" ? "active" : ""} to="/upload">
          Upload
        </Link>
        <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">
          Dashboard
        </Link>
        <Link className={location.pathname === "/profile" ? "active" : ""} to="/profile">
          Profile
        </Link>
      </nav>
      <div className="nav__user">
        {user ? (
          <>
            <span className="nav__user-email">{user.email}</span>
            <button className="btn secondary small" type="button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <Link
            className={location.pathname === "/login" ? "active" : ""}
            to="/login"
          >
            Log in
          </Link>
        )}
      </div>
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

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="empty">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function App() {
  const { dataReady } = useDataContext();

  return (
    <div className="app-shell">
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<EmptyState />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                {dataReady ? <DashboardPage /> : <Navigate to="/upload" replace />}
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}


