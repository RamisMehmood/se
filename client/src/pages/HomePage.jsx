import React, { useState } from 'react';
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
        <img src="/images/image1.png" alt="FiTrack Logo" className="login-logo" />
        <h2 className="login-heading">Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
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
          <a href="/forgot-password" className="login-link">Forgot Password?</a>
          <a href="/signup" className="login-link">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
