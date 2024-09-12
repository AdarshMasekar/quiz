import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Importing the CSS

const AdminDashboard = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleTakeQuiz = () => {
    navigate('/take'); // Navigate to the quiz-taking page
  };

  const handleViewResults = () => {
    navigate('/results'); // Navigate to the quiz results page
  };
  
  const handleCreateQuiz = () => {
    navigate('/create');
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">A modern and clean Admin Dashboard</p>
      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={handleCreateQuiz}>
          Add Questions
        </button>
        <button className="dashboard-button" onClick={handleViewResults}>
          View User Details
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
