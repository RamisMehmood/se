import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/EditPage.css";

const EditPage = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const images = ["/img1.png", "/img2.png", "/img3.png","/img4.png"];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:4000/edit/available", {
          credentials: "include",
        });
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlans();
  }, []);

  const formatWorkoutData = (workouts) => {
    try {
      const workoutData = typeof workouts === 'string' ? JSON.parse(workouts) : workouts;
      
      return Object.entries(workoutData).map(([category, exercises]) => {
        if (!exercises || exercises.length === 0) return null;
        
        const exerciseList = exercises.map(ex => 
          typeof ex === 'string' ? ex : ex.name || ex
        ).join(', ');
        
        return (
          <div key={category} className="workout-category">
            <span className="category-name">{category}:</span>
            <span className="exercise-list">{exerciseList}</span>
          </div>
        );
      });
    } catch (e) {
      return <div className="error-message">Could not load workout details</div>;
    }
  };

  const handleSelectPlan = (id) => {
    navigate(`/edit-workout/${id}`);
  };

  return (
    <div className="editpage-container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <div className="navbar-links">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/edit" className="nav-link active-link">Edit</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/calculations" className="nav-link">Calculations</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </div>
      </nav>

      <h1 className="page-title">Select a Workout Plan to Edit</h1>

      <div className="plans-grid">
        {plans.map((plan, index) => (
          <div key={plan.id} className="plan-card">
            <img 
              src={images[index % images.length]} 
              alt="Workout Plan" 
              className="plan-image"
            />
            
            <div className="plan-details">
              <div className="total-sets">Total Sets: {plan.totalsets}</div>
              
              <div className="workout-description">
                {formatWorkoutData(plan.workouts)}
              </div>
              
              <div className="button-spacer"></div>
              
              <button 
                className="edit-button"
                onClick={() => handleSelectPlan(plan.id)}
              >
                Edit Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditPage;