import { useAuth } from "../state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>
        <div className="profile-info">
          <div className="profile-field">
            <label>Name</label>
            <div className="profile-value">{user.name}</div>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <div className="profile-value">{user.email}</div>
          </div>
        </div>
        <button className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
