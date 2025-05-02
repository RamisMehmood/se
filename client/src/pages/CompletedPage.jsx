import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CompletedPage.css';

function CompletedPage() {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [date, setDate] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const navigate = useNavigate();
  const images = ["/img1.png", "/img2.png", "/img3.png", "/img4.png"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsRes = await fetch('http://localhost:4000/completed/view', {
          credentials: 'include'
        });
        const workoutsData = await workoutsRes.json();
        setCompletedWorkouts(workoutsData);

        const plansRes = await fetch('http://localhost:4000/edit/available', {
          credentials: 'include'
        });
        const plansData = await plansRes.json();
        setAvailablePlans(plansData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          workoutplan_id: selectedPlan,
          date,
          difficulty: parseInt(difficulty)
        }),
      });

      if (response.ok) {
        const workoutsRes = await fetch('http://localhost:4000/completed/view', {
          credentials: 'include'
        });
        const workoutsData = await workoutsRes.json();
        setCompletedWorkouts(workoutsData);
        setShowAddForm(false);
        setSelectedPlan('');
        setDate('');
        setDifficulty(3);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyText = (level) => {
    const difficultyMap = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard'
    };
    return difficultyMap[level] || level;
  };

  return (
    <div className="completed-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/completed" className="nav-link active-link">Completed</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <div className="completed-content">
        <h1 className="page-title">Your Completed Workouts</h1>

        <div className="workouts-list">
          {completedWorkouts.map((workout, index) => (
            <div key={workout.id} className="workout-card">
              <img 
                src={images[index % images.length]} 
                alt="Completed Workout" 
                className="workout-image"
              />
              <div className="workout-details">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(workout.date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Plan ID:</span>
                  <span className="detail-value">{workout.workoutplan_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Difficulty:</span>
                  <span className="detail-value">
                    {workout.difficulty} ({getDifficultyText(workout.difficulty)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="add-workout-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Log New Workout
        </button>

        {showAddForm && (
          <div className="add-workout-modal">
            <div className="modal-content">
              <h2 className="modal-title">Log New Workout</h2>
              
              <div className="form-group">
                <label className="form-label">Select Plan</label>
                <div className="plan-select-container">
                  <select
                    className="plan-select"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    required
                  >
                    <option value="">Choose a workout plan</option>
                    {availablePlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        Plan #{plan.id} - {plan.totalsets} sets
                      </option>
                    ))}
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Workout Date</label>
                <div className="date-picker-container">
                  <input
                    type="date"
                    className="date-picker"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <div className="difficulty-rating">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <React.Fragment key={level}>
                      <input
                        type="radio"
                        id={`difficulty-${level}`}
                        name="difficulty"
                        value={level}
                        checked={difficulty === level}
                        onChange={() => setDifficulty(level)}
                        className="difficulty-radio"
                      />
                      <label 
                        htmlFor={`difficulty-${level}`}
                        className="difficulty-label"
                      >
                        {level}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
                <div className="difficulty-scale">
                  <span>Easy</span>
                  <span>Hard</span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-btn cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="modal-btn confirm-btn"
                  onClick={handleAddWorkout}
                >
                  Log Workout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompletedPage;