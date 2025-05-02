import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/ProgressPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProgressPage() {
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState({
    avg_difficulty: 0,
    min_difficulty: 0,
    max_difficulty: 0,
    total_workouts: 0,
    status: 'loading'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/progress/difficulty/${period}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.status === 'error') {
        throw new Error(data?.message || 'Invalid data received');
      }

      setStats({
        avg_difficulty: parseFloat(data.avg_difficulty) || 0,
        min_difficulty: parseInt(data.min_difficulty) || 0,
        max_difficulty: parseInt(data.max_difficulty) || 0,
        total_workouts: parseInt(data.total_workouts) || 0,
        status: 'success'
      });

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setStats(prev => ({
        ...prev,
        status: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [period]);

  const chartData = {
    labels: ['Minimum', 'Average', 'Maximum'],
    datasets: [
      {
        label: 'Difficulty Level',
        data: [stats.min_difficulty, stats.avg_difficulty, stats.max_difficulty],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const labels = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
            return labels[value] || value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const labels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
            return `Difficulty: ${labels[context.raw - 1]} (${context.raw})`;
          }
        }
      }
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return '';
    }
  };

  const getDifficultyText = (level) => {
    const labels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
    return labels[Math.round(level) - 1] || 'N/A';
  };

  return (
    <div className="progress-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/completed" className="nav-link">Completed</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link active-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <div className="progress-content">
        <h1 className="page-title">Your Workout Progress</h1>
        
        <div className="period-selector">
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Weekly
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Monthly
          </button>
          <button
            className={`period-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => setPeriod('year')}
          >
            Yearly
          </button>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : error ? (
          <div className="error-message">
            <p>Error loading progress data</p>
            <p>{error}</p>
            <button onClick={fetchProgressData}>Retry</button>
          </div>
        ) : (
          <div className="progress-stats">
            <h2 className="stats-period">{getPeriodLabel()}</h2>
            <p className="total-workouts">Total workouts: {stats.total_workouts}</p>
            
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Minimum</h3>
                <div className="stat-value">{stats.min_difficulty}</div>
                <div className="stat-label">{getDifficultyText(stats.min_difficulty)}</div>
              </div>
              
              <div className="stat-card">
                <h3>Average</h3>
                <div className="stat-value">{stats.avg_difficulty.toFixed(1)}</div>
                <div className="stat-label">{getDifficultyText(stats.avg_difficulty)}</div>
              </div>
              
              <div className="stat-card">
                <h3>Maximum</h3>
                <div className="stat-value">{stats.max_difficulty}</div>
                <div className="stat-label">{getDifficultyText(stats.max_difficulty)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;