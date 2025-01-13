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
    <div className="login-page">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Bitchief Technology Services Pvt Ltd" className="logo" />
      </Link>
      <div className="container login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="form-login">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;