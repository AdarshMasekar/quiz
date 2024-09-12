import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Import the CSS file

const UserDashboard = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleTakeQuiz = () => {
    navigate('/take'); // Navigate to the quiz-taking page
  };

  const handleViewResults = () => {
    navigate('/results'); // Navigate to the quiz results page
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h2>User Dashboard</h2>
        <button className="take-quiz-btn" onClick={handleTakeQuiz}>Take Quiz</button>
        <button className="view-results-btn" onClick={handleViewResults}>View Past Results</button>
        
      </div>
    </div>
  );
};

export default UserDashboard;
