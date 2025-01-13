import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/assets/logo.png';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Bitchief Technology Services Pvt Ltd" className="logo" />
        </Link>
        <div className="navbar-buttons">
          {isHomePage ? (
            <>
              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-primary" to="/signup">
                Signup
              </Link>
            </>
          ) : (
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;