import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Import Firebase functions
import { doc, getDoc, collection, getDocs, setDoc, addDoc } from 'firebase/firestore'; // Ensure necessary Firebase functions are imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './QuizResults.css'; // Import the CSS

const QuizResults = () => {
  const [results, setResults] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [highScore, setHighScore] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.email); // Use email as userName for simplicity

        // Check user role from Firebase
        const userRef = doc(db, 'users', user.email); // Assuming email is used as document ID
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        setUserRole(userData?.role || '');

        // Fetch the latest user results directly from the 'results' collection
        const resultsQuerySnapshot = await getDocs(collection(db, 'results'));
        let resultsData = null;

        resultsQuerySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userEmail === user.email) { // Assuming you have userEmail in the results data
            resultsData = data;
          }
        });

        if (resultsData) {
          setHighScore(resultsData.score);

          const storedQuestions = resultsData.questionsAnswered || []; // Adjust based on your data structure
          setQuestions(storedQuestions);

          const userAnswers = resultsData.selectedAnswers || [];
          let correct = 0;
          let incorrect = 0;

          // Ensure userAnswers and storedQuestions are valid
          userAnswers.forEach((answer, index) => {
            const correctAnswer = storedQuestions[index]?.correct;
            if (answer === correctAnswer) {
              correct += 1;
            } else if (answer !== "not answered") { // Only count as incorrect if it was answered
              incorrect += 1;
            }
          });

          setResults(resultsData);
          setCorrectCount(correct);
          setIncorrectCount(incorrect);
        }
      } else {
        // Redirect to login if no user is logged in
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (userRole === 'admin') {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          const usersData = querySnapshot.docs.map((doc) => doc.data());
          // Sort users by highest quiz score in descending order
          usersData.sort((a, b) => {
            const scoreA = parseFloat(a.highestScore) || 0;
            const scoreB = parseFloat(b.highestScore) || 0;
            return scoreB - scoreA;
          });
          usersData.forEach((user, index) => {
            user.rank = index + 1;
          });
          // console.log(usersData);
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching users from Firebase:', error);
        }
      };

      fetchUsers();
    }
  }, [userRole]);

  if (!results || questions.length === 0) {
    return <p className="no-results">No quiz results or questions available.</p>;
  }

  return (
    <div className="quiz-results-container">
        <div>
          <h2 className="quiz-results-title">Quiz Results</h2>
          {userName && (
            <div className="user-info">
              <h2 className="user-name">Hello, {userName}</h2>
            </div>
          )}

          <p className="quiz-stats correct-answer">High Score: {highScore}</p>
          <p className="quiz-stats correct-answer">Correct Answers: {correctCount}</p>
          <p className="quiz-stats wrong-answer">Incorrect Answers: {incorrectCount}</p>

          {results && results.timeTaken !== undefined && (
            <p className="quiz-stats">Time taken: {Math.floor(results.timeTaken / 60)}:{('0' + (results.timeTaken % 60)).slice(-2)}</p>
          )}

          {results && results.timestamp && (
            <p className="quiz-date">Date: {new Date(results.timestamp).toLocaleString()}</p>
          )}

          {/* <h3 className="answers-title">Your Answers:</h3> */}
          <ul className="answers-list">
            {questions.length > 0 && results && results.selectedAnswers && results.selectedAnswers.map((answer, index) => (
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
    </div>
  );
};

export default QuizResults;
