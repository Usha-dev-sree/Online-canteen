import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiLock, FiArrowRight } from 'react-icons/fi';
import './AdminRoute.css';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied-page">
        <div className="access-denied-card">
          <div className="shield-icon-wrapper">
            <FiShield />
          </div>
          <h2>Admin Privileges Required</h2>
          <p>
            The page <code>/admin/dashboard</code> is restricted to Canteen Operations Staff.
            {user ? (
              <span> You are currently logged in as a <strong>Student ({user.email})</strong>.</span>
            ) : (
              <span> Please log in with an Admin account to manage orders and scan QR codes.</span>
            )}
          </p>

          <div className="access-denied-actions">
            <Link to="/login" className="save-btn login-as-admin-btn">
              <FiLock /> Log In as Admin
            </Link>
            <Link to="/" className="cancel-btn">
              Back to Food Menu <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
