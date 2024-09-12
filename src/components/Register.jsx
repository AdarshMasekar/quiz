import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      alert('Username already exists');
      return;
    }

    const newUser = { username, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('User registered successfully');

    // Clear inputs
    setUsername('');
    setPassword('');
    setRole('user');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registration Form</h2>
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
        <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>
        <p className="register-link-text">Already have an account? </p>
        <Link to="/login" className="login-link">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
