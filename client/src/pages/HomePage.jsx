import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // needed for redirecting

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important for session cookies
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Login successful!');
        navigate('/create'); // if successful, go to /create
      } else {
        console.error('Login failed');
        navigate('/error');  // if failed, go to /error
      }
    } catch (error) {
      console.error('Request error:', error);
      navigate('/error');
    }
  };

  return (
    <div className="login-centered-container">
      <div className="login-box">
        <img src="/logo.png" alt="FiTrack Logo" className="logo" />
        <h2 className="login-heading">Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"   // 🔥 changed to text because it's username not email
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Log In</button>
        </form>
        <div className="login-links">
          <Link to="/register" className="login-link">Sign Up</Link> {/* 🔥 Sign Up button preserved */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
