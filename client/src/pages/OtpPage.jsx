import React, { useState } from 'react';
import '../styles/OtpPage.css';

function OtpPage() {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('OTP Entered:', otp);

    // TODO: Add routing logic here after successful OTP verification
    // For example: navigate("/dashboard") or similar
  };

  return (
    <div className="otp-centered-container">
      <div className="otp-box">
        <img src="/logo.png" alt="FiTrack Logo" className="otp-logo" />
        <h2 className="otp-heading">Enter Verification Code</h2>
        <p className="otp-instruction">We sent a 6-digit code to your email</p>
        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            placeholder="Enter OTP"
            className="otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="otp-button">Verify</button>
        </form>
      </div>
    </div>
  );
}

export default OtpPage;
