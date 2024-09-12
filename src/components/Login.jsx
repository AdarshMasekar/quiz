import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(user => user.username === username && user.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser)); // Save logged-in user
      navigate(foundUser.role === 'admin' ? '/admin' : '/user'); // Redirect based on role
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <p className="login-link-text">Don't have an account? </p>
        <Link to="/register" className="register-link"> 
          <button className="register-btn">Register</button>
        </Link>
        
      </div>
    </div>
  );
};

export default Login;
