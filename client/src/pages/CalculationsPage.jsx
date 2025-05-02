import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CalculationsPage.css';

function CalculationsPage() {
  const [activeTab, setActiveTab] = useState('bmi');
  const [bmiData, setBmiData] = useState({ weight: '', height: '' });
  const [hrData, setHrData] = useState({ age: '', resting_heart_rate: '' });
  const [bmiResult, setBmiResult] = useState(null);
  const [hrResult, setHrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBmiChange = (e) => {
    const { name, value } = e.target;
    setBmiData(prev => ({ ...prev, [name]: value }));
  };

  const handleHrChange = (e) => {
    const { name, value } = e.target;
    setHrData(prev => ({ ...prev, [name]: value }));
  };

  const calculateBMI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBmiResult(null);

    try {
      const response = await fetch('http://localhost:4000/calculations/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          weight: parseFloat(bmiData.weight),
          height: parseFloat(bmiData.height)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate BMI');
      }

      const data = await response.json();
      setBmiResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateHeartRateZones = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHrResult(null);

    try {
      const response = await fetch('http://localhost:4000/calculations/heartrates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          age: parseInt(hrData.age),
          resting_heart_rate: parseInt(hrData.resting_heart_rate)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate heart rate zones');
      }

      const data = await response.json();
      setHrResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="calculations-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/completed" className="nav-link">Completed</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link active-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <div className="calculations-content">
        <div className="page-header">
          <h1 className="page-title">Fitness Calculators</h1>
          <p className="page-subtitle">Get insights into your fitness metrics</p>
        </div>

        <div className="calculator-tabs">
          <button
            className={`tab-btn ${activeTab === 'bmi' ? 'active' : ''}`}
            onClick={() => setActiveTab('bmi')}
          >
            BMI Calculator
          </button>
          <button
            className={`tab-btn ${activeTab === 'heartrate' ? 'active' : ''}`}
            onClick={() => setActiveTab('heartrate')}
          >
            Heart Rate Zones
          </button>
        </div>

        {loading && <div className="loading-indicator">Calculating...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="calculator-animation-wrapper">
          {activeTab === 'bmi' ? (
            <div className="calculator-form">
              <h2>BMI Calculator</h2>
              <form onSubmit={calculateBMI}>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={bmiData.weight}
                    onChange={handleBmiChange}
                    step="0.1"
                    min="30"
                    max="300"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Height (m)</label>
                  <input
                    type="number"
                    name="height"
                    value={bmiData.height}
                    onChange={handleBmiChange}
                    step="0.01"
                    min="1.0"
                    max="2.5"
                    required
                  />
                </div>
                <button type="submit" className="calculate-btn">
                  Calculate BMI
                </button>
              </form>

              {bmiResult && (
                <div className="result-container">
                  <h3>Your Results</h3>
                  <div className="result-card">
                    <p>BMI: <strong>{bmiResult.toFixed(1)}</strong></p>
                    <p>Category: <strong>{getBmiCategory(bmiResult)}</strong></p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="calculator-form">
              <h2>Heart Rate Zones</h2>
              <form onSubmit={calculateHeartRateZones}>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={hrData.age}
                    onChange={handleHrChange}
                    min="10"
                    max="100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Resting Heart Rate (bpm)</label>
                  <input
                    type="number"
                    name="resting_heart_rate"
                    value={hrData.resting_heart_rate}
                    onChange={handleHrChange}
                    min="40"
                    max="120"
                    required
                  />
                </div>
                <button type="submit" className="calculate-btn">
                  Calculate Zones
                </button>
              </form>

              {hrResult && (
                <div className="result-container">
                  <h3>Your Heart Rate Zones</h3>
                  <div className="zones-grid">
                    <div className="zone-card">
                      <h4>Zone 1 (Very Light)</h4>
                      <p>{hrResult.zone1[0]} - {hrResult.zone1[1]} bpm</p>
                    </div>
                    <div className="zone-card">
                      <h4>Zone 2 (Light)</h4>
                      <p>{hrResult.zone2[0]} - {hrResult.zone2[1]} bpm</p>
                    </div>
                    <div className="zone-card">
                      <h4>Zone 3 (Moderate)</h4>
                      <p>{hrResult.zone3[0]} - {hrResult.zone3[1]} bpm</p>
                    </div>
                    <div className="zone-card">
                      <h4>Zone 4 (Hard)</h4>
                      <p>{hrResult.zone4[0]} - {hrResult.zone4[1]} bpm</p>
                    </div>
                    <div className="zone-card">
                      <h4>Zone 5 (Maximum)</h4>
                      <p>{hrResult.zone5[0]} - {hrResult.zone5[1]} bpm</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalculationsPage;