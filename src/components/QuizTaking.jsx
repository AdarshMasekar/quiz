import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig'; // Import Firestore and Auth instances
import { collection, getDocs, getDoc, doc, setDoc, addDoc } from 'firebase/firestore'; // Firestore functions
import { onAuthStateChanged } from 'firebase/auth'; // Auth function
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
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate('/login'); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch questions from Firebase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data());
        setQuestions(getRandomQuestions(fetchedQuestions, 20)); // Choose a random set of 20 questions
      } catch (error) {
        console.error('Error fetching questions from Firebase:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Timer for quiz
  useEffect(() => {
    let timer;
    if (quizStarted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Submit quiz when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted]);

  // Handle answer selection
  const handleAnswerChange = (answer, index) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const timeTakenDuringQuiz = 20 * 60 - timeLeft;
    const sanitizedAnswers = (selectedAnswers || []).map((answer) => answer !== undefined ? answer : 'not answered');
    const sanitizedQuestions = questions || [];
    let score = 0;
    const correctAnswers = sanitizedQuestions.map((q) => q.correct); // Collect correct answers for each question
    
    sanitizedAnswers.forEach((answer, index) => {
      const correctAnswer = sanitizedQuestions[index]?.correct;
      if (answer === correctAnswer) {
        score += 1;
      }
    });
  
    if (userEmail) {
      try {
        const result = {
          userEmail: userEmail || 'anonymous',
          score: score || 0,
          timeTaken: timeTakenDuringQuiz,
          timestamp: new Date().toISOString(),
          userAnswers: sanitizedAnswers, // Store user's answers
          correctAnswers: correctAnswers, // Store correct answers for comparison
          questionsAnswered: sanitizedQuestions, // Store questions text for display in results
        };
  
        const resultsRef = doc(db, 'results', userEmail);
        await setDoc(resultsRef, result);
  
        // Updating user information in the 'users' collection
        const usersRef = doc(db, 'users', userEmail);
        const previousResult = await getDoc(usersRef);
  
        if (previousResult.exists()) {
          const previousData = previousResult.data();
          const updatedData = {
            ...previousData,
            highestScore: Math.max(previousData.highestScore || 0, score || 0),
          };
          await setDoc(usersRef, updatedData);
        } else {
          const userData = {
            email: userEmail,
            highestScore: score || 0,
            quizzesTaken: 1,
            rank: 0,
            registrationDate: new Date().toISOString(),
            role: 'user',
            timeTakenForBestScore: timeTakenDuringQuiz,
            uid: userEmail,
            username: userEmail,
          };
          await setDoc(usersRef, userData);
        }
  
        navigate('/results'); // Redirect to results after quiz is submitted
      } catch (error) {
        console.error('Error updating user data in Firebase:', error);
      }
    }
  };
  
  
  if (!questions.length || !questions[currentQuestionIndex]) {
    return <p className='no-results'>No questions available or invalid question index.</p>;
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
                <p>
                  <strong>{q.question}</strong>
                </p>
                <ul>
                  {q.options.map((opt, idx) => (
                    <li className="option" key={idx}>
                      {opt} {opt === q.correct && '(Correct)'}
                    </li>
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
              <p className="question">{currentQuestion.question}</p>
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`option-label ${selectedAnswers[currentQuestionIndex] === option ? 'selected' : 'not answered'}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    onChange={() => handleAnswerChange(option, currentQuestionIndex)}
                    checked={selectedAnswers[currentQuestionIndex] === option}
                    className="option-input"
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="nav-buttons">
              {currentQuestionIndex < questions.length - 1 && (
                <>
                  {currentQuestionIndex !== 0 && (
                    <button
                      className="prev-button"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                      Prev Question
                    </button>
                  )}
                  <button className="next-button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
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
