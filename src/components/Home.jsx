import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you'll use a separate CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="overlay">
          <h1>Welcome to QuizMaster – Test Your Knowledge!</h1>
          <p>
            Welcome to the ultimate quiz platform that challenges your intellect and broadens your knowledge. Get started today!
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn register-btn">Register</Link>
            <Link to="/quizzes" className="btn take-quiz-btn">Take Quizzes</Link>
          </div>
        </div>
      </header>
      
      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">
            {/* You can use icons from libraries like FontAwesome or custom SVGs */}
            <i className="fas fa-question-circle"></i>
          </div>
          <h3>Quiz Creation</h3>
          <p>Create new quizzes with multiple options and customize them to fit your needs.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-stopwatch"></i>
          </div>
          <h3>Timed Quizzes</h3>
          <p>Engage in timed quizzes to test your knowledge under pressure.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>Result Analysis</h3>
          <p>Track your Result and improve with detailed results and feedback.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Leaderboard</h3>
          <p>Join the community and participate in quizzes created by others.</p>
        </div>
      </section>

      <section className="cta-section">
        <button className="cta-btn">Get Started Now</button>
      </section>
    </div>
  );
};

export default Home;
