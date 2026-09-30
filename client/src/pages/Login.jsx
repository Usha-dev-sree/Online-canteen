import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import toast from 'react-hot-toast';
import './AuthPages.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate(res.data.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" id="login-card">
        <div className="auth-header">
          <MdRestaurantMenu className="auth-logo" />
          <h2>Welcome Back</h2>
          <p>Login to place orders or manage canteen operations</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" id="login-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : (
              <>
                <span>Login</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
