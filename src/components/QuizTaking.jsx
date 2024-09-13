import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs } from '../firebaseConfig'; // Import Firebase functions
import './QuizTaking.css'; // Import the CSS

const getRandomQuestions = (questions, num) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const QuizTaking = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(true);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if not logged in
      return;
    }
    setUsername(loggedInUser.username);

    // Fetch questions from Firebase
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const fetchedQuestions = querySnapshot.docs.map(doc => doc.data());
        setQuestions(getRandomQuestions(fetchedQuestions, 20)); // Choose a random set of 20 questions
      } catch (error) {
        console.error('Error fetching questions from Firebase:', error);
      }
    };

    fetchQuestions();
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (quizStarted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      if (timeLeft === 0) {
        handleSubmit(); // Submit quiz when time is up
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const handleAnswerChange = (answer, index) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = answer;
    setSelectedAnswers(updatedAnswers);
  };
  
  const handleSubmit = () => {
    const results = {
      selectedAnswers,
      timeTaken: 20 * 60 - timeLeft, // Time taken to complete the quiz
      timestamp: new Date().toISOString(),
      shuffledQuestions: questions, // Save the shuffled questions
    };
    localStorage.setItem('quizResults', JSON.stringify(results)); // Store results in localStorage
    navigate('/results');
  };

  if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
    return <p>No questions available or invalid question index.</p>;
  }
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {/* Sidebar */}
      <div className="quiz-sidebar">
        <button className="toggle-button" onClick={() => setShowAllQuestions(!showAllQuestions)}>
          {showAllQuestions ? 'Show Sidebar' : 'Show All Questions'}
        </button>
        {!showAllQuestions && (
          <ul className="question-nav">
            {questions.map((_, index) => (
              <li key={index}>
                <button
                  className={`question-nav-button ${index === currentQuestionIndex ? 'active' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="quiz-main-content">
        {showAllQuestions ? (
          <div className="all-questions-container">
            <h2>All Questions</h2>
            {questions.map((q, index) => (
              <div key={index} className="all-question-item">
                <p><strong>{q.question}</strong></p>
                <ul>
                  {q.options.map((opt, idx) => (
                    <li className='option' key={idx}>{opt} {opt === q.correct && '(Correct)'}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="current-question-container">
            <h2>Quiz in Progress</h2>
            <p className="timer">
              Time left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
            </p>
            <div className="question-container">
            <p className='question'>{currentQuestion.question}</p>
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`option-label ${selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  onChange={() => handleAnswerChange(option, currentQuestionIndex)}
                  checked={selectedAnswers[currentQuestionIndex] === option}
                  className='option-input'
                />
                {option}
              </label>
            ))}
            </div>

            <div className="nav-buttons">
              {currentQuestionIndex < questions.length - 1 && (
                <>
                  { currentQuestionIndex !== 0 &&
                    <button
                    className="prev-button"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  >
                    Prev Question
                  </button>
                  }
                  <button
                    className="next-button"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  >
                    Next Question
                  </button>
                </>
              )}
              {currentQuestionIndex === questions.length - 1 && (
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTaking;
