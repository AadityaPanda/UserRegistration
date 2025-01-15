import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Login.css';
import logo from '/assets/logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user) {
          // Store the complete user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        if (data.user.isAdmin) {
          setUsername(''); 
          setPassword(''); 
          localStorage.setItem('admin', JSON.stringify(data.user)); 
          navigate('/admin');
          toast.success('Login successful! Welcome, Admin.');
        } else {
          navigate('/dashboard');
          toast.success('Login successful! Welcome to your dashboard.');
        }
      } else {
        toast.error(data.error || 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page-bts">
      <div className="container login-container-bts">
        <Link to="/" className="logo-link-bts">
          <img src={logo} alt="Bitchief Technology Services Pvt Ltd" className="logo-bts" />
        </Link>
        <h1 className="login-title-bts">Login</h1>
        <form onSubmit={handleSubmit} className="form-login-bts">
          <div className="form-group-bts">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control-bts"
            />
          </div>
          <div className="form-group-bts">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-bts"
            />
          </div>
          <button type="submit" className="btn btn-primary-bts btn-block-bts">
            Login
          </button>
        </form>
        <div className="signup-link-bts">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;