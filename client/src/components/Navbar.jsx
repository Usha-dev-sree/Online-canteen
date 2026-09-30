import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="nav-brand" onClick={() => setMobileOpen(false)}>
          <MdRestaurantMenu className="brand-icon" />
          <span>OnlineCanteen</span>
        </Link>

        <button
          className="mobile-toggle"
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" id="nav-home" onClick={() => setMobileOpen(false)}>
            Menu
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="nav-link" id="nav-orders" onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="nav-link admin-link" id="nav-admin-dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/admin/menu" className="nav-link admin-link" id="nav-admin-menu" onClick={() => setMobileOpen(false)}>
                    Manage Menu
                  </Link>
                </>
              )}

              <Link to="/cart" className="nav-link cart-link" id="nav-cart" onClick={() => setMobileOpen(false)}>
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>

              <div className="nav-user" id="nav-user-info">
                <FiUser className="user-icon" />
                <span className="user-name">{user.name}</span>
              </div>

              <button className="nav-btn logout-btn" id="nav-logout" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-btn register-btn" id="nav-register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
