import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import { auth, db } from '../firebaseConfig'; // Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firestore methods
import { setDoc, doc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [popUpvisible,setPopUpVisible] = useState(false)
  
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create or update user document in Firestore with UID as the document ID
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username: username,
        role: role
      });
      setPopUpVisible(true);
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };
  

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registration Form</h2>
        {error && <p className="error-text">{error}</p>}
        {popUpvisible && <p className='success-text'>User Registered successfully</p>}
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
