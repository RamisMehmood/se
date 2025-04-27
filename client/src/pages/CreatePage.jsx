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

  useEffect(() => {
    fetch('http://localhost:4000/create-workout', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error('Error fetching exercises:', err));
  }, []);

  const handleCheckboxChange = (category, exercise) => {
    setSelectedExercises(prev => {
      const alreadySelected = prev[category].includes(exercise);
      return {
        ...prev,
        [category]: alreadySelected
          ? prev[category].filter(item => item !== exercise)
          : [...prev[category], exercise],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = {
      UpperBody: selectedExercises.UpperBody,
      LowerBody: selectedExercises.LowerBody,
      Cardio: selectedExercises.Cardio,
      Bodyweight: selectedExercises.Bodyweight,
    };
    try {
      const response = await fetch('http://localhost:4000/create-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          workouts: workoutData,
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
      } else {
        setSuccessMessage('Error saving workout.');
      }
    } catch (error) {
      console.error('Error submitting workout:', error);
      setSuccessMessage('Error saving workout.');
    }
  };

  return (
    <div className="createworkout-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/edit" className="nav-link">Edit</Link>
          <Link to="/create" className="nav-link active-link">Create-Workout</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <h1 className="page-title">Create Your Workout</h1>

      <form onSubmit={handleSubmit} className="workout-form">
        <div className="fields-grid">
          <div className="field-section">
            <img src="/img1.png" alt="UpperBody" className="field-img" />
            <details className="dropdown">
              <summary>Upper Body</summary>
              {exercises.UpperBody.map((exercise, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedExercises.UpperBody.includes(exercise)}
                    onChange={() => handleCheckboxChange('UpperBody', exercise)}
                  />
                  {exercise}
                </label>
              ))}
            </details>
          </div>

          <div className="field-section">
            <img src="/img2.png" alt="LowerBody" className="field-img" />
            <details className="dropdown">
              <summary>Lower Body</summary>
              {exercises.LowerBody.map((exercise, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedExercises.LowerBody.includes(exercise)}
                    onChange={() => handleCheckboxChange('LowerBody', exercise)}
                  />
                  {exercise}
                </label>
              ))}
            </details>
          </div>

          <div className="field-section">
            <img src="/img3.png" alt="Bodyweight" className="field-img" />
            <details className="dropdown">
              <summary>Body Weight</summary>
              {exercises.Bodyweight.map((exercise, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedExercises.Bodyweight.includes(exercise)}
                    onChange={() => handleCheckboxChange('Bodyweight', exercise)}
                  />
                  {exercise}
                </label>
              ))}
            </details>
          </div>

          <div className="field-section">
            <img src="/img4.png" alt="Cardio" className="field-img" />
            <details className="dropdown">
              <summary>Cardio</summary>
              {exercises.Cardio.map((exercise, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedExercises.Cardio.includes(exercise)}
                    onChange={() => handleCheckboxChange('Cardio', exercise)}
                  />
                  {exercise}
                </label>
              ))}
            </details>
          </div>
        </div>

        <input
          type="number"
          placeholder="Enter Total Sets"
          value={totalSets}
          onChange={(e) => setTotalSets(e.target.value)}
          className="sets-input"
          required
        />

        <button type="submit" className="save-button">Save Workout</button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}

export default CreateWorkoutPage;
