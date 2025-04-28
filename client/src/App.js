import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OtpPage from './pages/OtpPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import EditPage from './pages/EditPage.jsx';
import EditWorkoutPage from './pages/EditWorkoutPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/edit-workout/:id" element={<EditWorkoutPage />} /> {/* <-- added this */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
