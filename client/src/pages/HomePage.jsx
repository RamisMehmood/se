import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-centered-container">
      <div className="login-box">
        <img src= "/logo.png" alt="FiTrack Logo" className="logo" />
        <h2 className="login-heading">Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input  
            type="email"
            placeholder="UserName"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Link to="/register" className="login-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
