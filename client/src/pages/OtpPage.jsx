import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OtpPage.css';

function OTPPage() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate(); // using react-router navigation instead of window.location

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // important: send session cookies
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP verified:', data.message);
        navigate('/'); // Navigate to home page
      } else {
        console.error('OTP error:', data.message);
        navigate('/error');  // Navigate to error page
      }
    } catch (error) {
      console.error('Request error:', error);
      navigate('/error'); // Navigate to error page if request fails
    }
  };

  return (
    <div className="otp-centered-container">
      <div className="otp-box">
        <img src="/logo.png" alt="Logo" className="otp-logo" />
        <h1 className="otp-heading">Verify OTP</h1>
        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            placeholder="Enter OTP"
            className="otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="otp-button">Verify</button>
        </form>
      </div>
    </div>
  );
}

export default OTPPage;
