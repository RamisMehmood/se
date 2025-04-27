import React from 'react';
import '../styles/ErrorPage.css';

function ErrorPage() {
  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-centered-container">
      <div className="error-box">
        <img src="/logo.png" alt="Logo" className="error-logo" />
        <h1 className="error-heading">Error</h1>
        <p className="error-message">Something went wrong. Please try again.</p>
        <button onClick={handleGoBack} className="error-button">Go Back</button>
      </div>
    </div>
  );
}

export default ErrorPage;
