import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SupportPage.css';

function SupportPage() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:4000/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('');
        setCharCount(0);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Error submitting support request:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  return (
    <div className="support-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/completed" className="nav-link">Completed</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link active-link">Support</Link>
        </div>
      </nav>

      <div className="support-content">
        <div className="support-header">
          <h1 className="page-title">Contact Support</h1>
          <p className="support-subtitle">Have questions or need assistance? Our team is ready to help.</p>
        </div>

        <div className="support-form-container">
          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-group">
              <label htmlFor="support-message">Your Message</label>
              <textarea
                id="support-message"
                value={message}
                onChange={handleMessageChange}
                placeholder="Describe your issue or question in detail..."
                rows="6"
                maxLength="1000"
                required
              />
              <div className="char-counter">{charCount}/1000 characters</div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || message.length === 0}
            >
              {isSubmitting ? 'Sending...' : 'Submit Request'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="status-message success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span>Your message has been sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>Something went wrong. Please try again later.</span>
            </div>
          )}
        </div>

        <div className="support-footer">
          <div className="support-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <p>Need immediate help? We're here for you 24/7. Your feedback helps us improve!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;