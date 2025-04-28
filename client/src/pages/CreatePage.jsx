import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CreatePage.css';

function CreateWorkoutPage() {
  const [exercises, setExercises] = useState({
    UpperBody: [],
    LowerBody: [],
    Cardio: [],
    Bodyweight: [],
  });
  const [selectedExercises, setSelectedExercises] = useState({
    UpperBody: [],
    LowerBody: [],
    Cardio: [],
    Bodyweight: [],
  });
  const [totalSets, setTotalSets] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inputError, setInputError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/create-workout', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error('Error fetching exercises:', err));
  }, []);

  const handleCheckboxChange = (category, exercise) => {
    setSelectedExercises(prev => ({
      ...prev,
      [category]: prev[category].includes(exercise)
        ? prev[category].filter(item => item !== exercise)
        : [...prev[category], exercise]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalSets) {
      setInputError(true);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/create-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          workouts: selectedExercises,
          totalSets: totalSets,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Workout Saved Successfully!');
        setSelectedExercises({
          UpperBody: [],
          LowerBody: [],
          Cardio: [],
          Bodyweight: [],
        });
        setTotalSets('');
        setInputError(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('Error saving workout');
    }
  };

  return (
    <div className="createworkout-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link active-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <div className="workout-content">
        <h1 className="page-title">Create Your Workout</h1>

        <form onSubmit={handleSubmit} className="workout-form">
          <div className="category-grid">
            {/* Row 1 */}
            <div className="category-row">
              <div className="category-card">
                <div className="category-header">
                  <img src="/img1.png" alt="Upper Body" className="category-image" />
                  <h2 className="category-title">Upper Body</h2>
                </div>
                <div className="exercises-container">
                  {exercises.UpperBody.map((exercise, index) => (
                    <button
                      type="button"
                      key={`upper-${index}`}
                      className={`exercise-btn ${
                        selectedExercises.UpperBody.includes(exercise) ? 'selected' : ''
                      }`}
                      onClick={() => handleCheckboxChange('UpperBody', exercise)}
                    >
                      {exercise}
                      <span className="exercise-checkmark">✓</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-card">
                <div className="category-header">
                  <img src="/img2.png" alt="Lower Body" className="category-image" />
                  <h2 className="category-title">Lower Body</h2>
                </div>
                <div className="exercises-container">
                  {exercises.LowerBody.map((exercise, index) => (
                    <button
                      type="button"
                      key={`lower-${index}`}
                      className={`exercise-btn ${
                        selectedExercises.LowerBody.includes(exercise) ? 'selected' : ''
                      }`}
                      onClick={() => handleCheckboxChange('LowerBody', exercise)}
                    >
                      {exercise}
                      <span className="exercise-checkmark">✓</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="category-row">
              <div className="category-card">
                <div className="category-header">
                  <img src="/img3.png" alt="Bodyweight" className="category-image" />
                  <h2 className="category-title">Body Weight</h2>
                </div>
                <div className="exercises-container">
                  {exercises.Bodyweight.map((exercise, index) => (
                    <button
                      type="button"
                      key={`bodyweight-${index}`}
                      className={`exercise-btn ${
                        selectedExercises.Bodyweight.includes(exercise) ? 'selected' : ''
                      }`}
                      onClick={() => handleCheckboxChange('Bodyweight', exercise)}
                    >
                      {exercise}
                      <span className="exercise-checkmark">✓</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-card">
                <div className="category-header">
                  <img src="/img4.png" alt="Cardio" className="category-image" />
                  <h2 className="category-title">Cardio</h2>
                </div>
                <div className="exercises-container">
                  {exercises.Cardio.map((exercise, index) => (
                    <button
                      type="button"
                      key={`cardio-${index}`}
                      className={`exercise-btn ${
                        selectedExercises.Cardio.includes(exercise) ? 'selected' : ''
                      }`}
                      onClick={() => handleCheckboxChange('Cardio', exercise)}
                    >
                      {exercise}
                      <span className="exercise-checkmark">✓</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="workout-actions">
            <div className="input-group">
              <label htmlFor="totalSets">Total Sets</label>
              <input
                id="totalSets"
                type="number"
                placeholder="Enter Total Sets"
                value={totalSets}
                onChange={(e) => {
                  setTotalSets(e.target.value);
                  setInputError(false);
                }}
                className={`sets-input ${inputError ? 'error' : ''}`}
                min="1"
                required
              />
              {inputError && (
                <span className="error-message">Please enter total sets</span>
              )}
            </div>

            <button type="submit" className="save-workout-btn">
              Save Workout
            </button>

            {successMessage && (
              <div className={`success-message ${
                successMessage.includes('Error') ? 'error' : ''
              }`}>
                {successMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutPage;