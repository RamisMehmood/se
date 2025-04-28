import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/EditWorkoutPage.css';

function EditWorkoutPage() {
  const { id } = useParams();
  const [exercises, setExercises] = useState({
    UpperBody: [],
    LowerBody: [],
    Cardio: [],
    Bodyweight: []
  });
  const [selectedExercises, setSelectedExercises] = useState({
    UpperBody: [],
    LowerBody: [],
    Cardio: [],
    Bodyweight: []
  });
  const [totalSets, setTotalSets] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/create-workout', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(err => console.error('Error fetching exercises:', err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:4000/edit/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        let workoutData = data.workouts || data;
        if (typeof workoutData === 'string') workoutData = JSON.parse(workoutData);
        
        const initialSelected = {
          UpperBody: workoutData.UpperBody?.map(ex => typeof ex === 'string' ? ex : ex.name || ex) || [],
          LowerBody: workoutData.LowerBody?.map(ex => typeof ex === 'string' ? ex : ex.name || ex) || [],
          Cardio: workoutData.Cardio?.map(ex => typeof ex === 'string' ? ex : ex.name || ex) || [],
          Bodyweight: workoutData.Bodyweight?.map(ex => typeof ex === 'string' ? ex : ex.name || ex) || []
        };
        
        setSelectedExercises(initialSelected);
        setTotalSets(data.totalSets || data.totalsets || '');
      })
      .catch(err => console.error('Error:', err));
  }, [id]);

  const toggleExercise = (category, exercise) => {
    setSelectedExercises(prev => ({
      ...prev,
      [category]: prev[category].includes(exercise)
        ? prev[category].filter(ex => ex !== exercise)
        : [...prev[category], exercise]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          workouts: selectedExercises,
          totalSets: totalSets
        })
      });
      setSuccessMessage(response.ok ? 'Workout Updated!' : 'Error updating');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('Error updating workout');
    }
  };

  return (
    <div className="editworkout-container">
      <nav className="navbar">
        <img src="/logo.png" alt="FITRACK Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/edit" className="nav-link active-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <div className="workout-content">
        <h1 className="page-title">Edit Your Workout</h1>
        
        <form onSubmit={handleSubmit} className="workout-form">
          <div className="categories-grid">
            {Object.entries(exercises).map(([category, exercisesList]) => (
              <div key={category} className="category-card">
                <h2 className="category-title">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <div className="exercises-list">
                  {exercisesList.map(exercise => (
                    <button
                      key={exercise}
                      type="button"
                      className={`exercise-btn ${
                        selectedExercises[category]?.includes(exercise) ? 'selected' : ''
                      }`}
                      onClick={() => toggleExercise(category, exercise)}
                    >
                      {exercise}
                      <span className="checkmark">✓</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-footer">
            <input
              type="number"
              value={totalSets}
              onChange={(e) => setTotalSets(e.target.value)}
              className="sets-input"
              placeholder="Total Sets"
              min="1"
              required
            />
            <button type="submit" className="save-btn">Save Workout</button>
            {successMessage && (
              <div className={`message ${successMessage.includes('Error') ? 'error' : 'success'}`}>
                {successMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorkoutPage;