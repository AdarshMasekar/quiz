import React, { useEffect, useState } from 'react';
import './QuizResults.css'; // Import the CSS

const QuizResults = () => {
  const [results, setResults] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userRole = loggedInUser?.role;
    const userName = loggedInUser?.username;
    setUserRole(userRole);
    setUserName(userName);

    const storedResults = JSON.parse(localStorage.getItem('quizResults'));
    const storedQuestions = storedResults?.shuffledQuestions || [];

    if (storedQuestions.length > 0 && storedResults) {
      const userAnswers = storedResults.selectedAnswers;
      let correct = 0;
      let incorrect = 0;

      userAnswers.forEach((answer, index) => {
        const correctAnswer = storedQuestions[index]?.correct;
        if (answer === correctAnswer) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      });

      setQuestions(storedQuestions);
      setResults(storedResults);
      setCorrectCount(correct);
      setIncorrectCount(incorrect);
    }
  }, []);

  if (!results || questions.length === 0) {
    return <p className="no-results">No quiz results or questions available.</p>;
  }

  const isAdmin = userRole === 'admin';

  return (
    <div className="quiz-results-container">
      {isAdmin && (
        <div className="admin-section">
          <h3 className="admin-title">All User's Details:</h3>
          {/* Admin-specific content */}
        </div>
      )}
      <h2 className="quiz-results-title">Quiz Results</h2>
      {!isAdmin && userName && (
        <div className="user-info">
          <h2 className="user-name">Hello, {userName}</h2>
        </div>
      )}
      <p className="quiz-stats">Time taken: {Math.floor(results.timeTaken / 60)}:{('0' + (results.timeTaken % 60)).slice(-2)}</p>
      <p className="quiz-stats correct-answer">Correct Answers: {correctCount}</p>
      <p className="quiz-stats wrong-answer">Incorrect Answers: {incorrectCount}</p>
      <p className="quiz-date">Date: {new Date(results.timestamp).toLocaleString()}</p>

      <h3 className="answers-title">Your Answers:</h3>
      <ul className="answers-list">
        {results.selectedAnswers.map((answer, index) => (
          <li key={index} className="answer-item">
            <strong className="question-title">Q{index + 1}: {questions[index]?.question}</strong><br />
            <span className={`answer ${answer === questions[index]?.correct ? 'correct-answer' : 'wrong-answer'}`}>
              Your Answer: {answer || 'No answer'}
            </span><br />
            <span className="correct-answer">Correct Answer: {questions[index]?.correct}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;
