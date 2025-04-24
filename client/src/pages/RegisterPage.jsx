import React, { useState } from 'react';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // LAST ACTIVITY: Register connected to OTP
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // important for session data
        body: JSON.stringify({ username, password, email })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP sent:', data.message);
        window.location.href = 'http://localhost:3000/otp'; // Frontend route for OTP page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="register-centered-container">
      <div className="register-box">
        <img src="/logo.png" alt="Logo" className="register-logo" />
        <h1 className="register-heading">Sign Up</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="register-button">Sign Up</button>
        </form>
        <div className="register-links">
          <a href="/" className="register-link">Already have an account?</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
