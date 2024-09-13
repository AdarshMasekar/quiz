import React from 'react';  
import { useNavigate } from 'react-router-dom';  
import './UserDashboard.css';   

const UserDashboard = () => {  
  const navigate = useNavigate();   

  const handleTakeQuiz = () => {  
    navigate('/take');   
  };  

  const handleViewResults = () => {  
    navigate('/results');   
  };  

  return (  
    <div className="dashboard-container">  
      <div className="hero-section">  
        <h2 className="hero-title">User Dashboard</h2>  
        <p className="hero-subtitle">Take quizzes, track your progress, and view your results.</p>  
      </div>  
      <div className="dashboard-content">  
        <div className="dashboard-info">  
          <button className="button-card" onClick={handleTakeQuiz}>  
            Take Quiz  
          </button>  
          <button className="button-card" onClick={handleViewResults}>  
            View Past Results  
          </button>  
        </div>  
        <div className="dashboard-info">  
          <div className="info-card">  
            <h3>Progress</h3>  
            <p className="info-value">70%</p>  
            <p className="info-description">Your overall progress so far.</p>  
          </div>  
          <div className="info-card">  
            <h3>Completed Quizzes</h3>  
            <p className="info-value">10</p>  
            <p className="info-description">Number of quizzes you've completed.</p>  
          </div>  
          <div className="info-card">  
            <h3>Average Score</h3>  
            <p className="info-value">80%</p>  
            <p className="info-description">Your average score across all quizzes.</p>  
          </div>
          <div className="info-card">  
            <h3>High Score</h3>  
            <p className="info-value">15/20</p>  
            <p className="info-description">Your high score across all quizzes.</p>  
          </div>    
        </div>  
      </div>  
    </div>  
  );  
};  

export default UserDashboard;