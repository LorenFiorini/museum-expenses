import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import { useDataContext } from "./state/DataContext";

function NavBar() {
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

  return (
    <div className="app-shell">
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<EmptyState />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route
            path="/dashboard"
            element={dataReady ? <DashboardPage /> : <Navigate to="/upload" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

