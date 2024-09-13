import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { auth, db } from '../firebaseConfig'; // Firebase config

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Step 1: Authenticate user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Firebase Authentication user object
  
      // Step 2: Fetch additional user details from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData); // Set user data in state
        localStorage.setItem('loggedInUser', JSON.stringify(userData)); // Save logged-in user
        navigate(userData.role === 'admin' ? '/admin' : '/user'); // Redirect based on role
      } else {
        throw new Error('User data not found in Firestore');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError(`Error: ${error.message}`); // Show error message
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="input-container">
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
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
