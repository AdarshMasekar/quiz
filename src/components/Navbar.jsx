// Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Navbar.css"

const Navbar = ({ user, handleLogout }) => {
  const location = useLocation();

  // Don't show Navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className='logo'>QuizMaker</Link>
      </div>
      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : user.role === 'admin' ? (
          <>
          
          <Link to="/admin">Dashboard</Link>
            <Link to="/create">Add Questions</Link>
            <Link to="/results">See User Details</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/user">Dashboard</Link>
            <Link to="/take">Take Quiz</Link>
            <Link to="/results">See Results</Link>
            <button id="logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




