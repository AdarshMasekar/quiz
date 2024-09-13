// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import QuizCreation from './components/QuizCreation';
import QuizTaking from './components/QuizTaking';
import QuizResults from './components/QuizResults';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Navbar from './components/Navbar'; // Import the Navbar component
import LeaderBoard from './components/LeaderBoard'

function App() {
  const questions = JSON.parse(localStorage.getItem('questions'));
  const [user, setUser] = useState(null); // State to track the logged-in user

  // On component mount, check if user is already logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser); // Set the logged-in user state from localStorage
    }
  }, []);

  const handleLogout = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem('loggedInUser'); // Clear the logged-in user from localStorage
  };

  return (
    <Router>
      {/* Navbar is now inside Router */}
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        {/* Role-based routes */}
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/create" element={<QuizCreation />} />
                <Route path='/leaderboard' element={<LeaderBoard/>} />
              </>
            ) : (
              <>
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/take" element={<QuizTaking questions={questions} />} />
                <Route path="/results" element={<QuizResults />} />
              </>
            )}
            <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin' : '/user'} />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
