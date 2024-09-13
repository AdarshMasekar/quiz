// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAScI2ws7B0Uv8owjj9WvwTnbpAPXuw4rM",
    authDomain: "quizapp-dabad.firebaseapp.com",
    projectId: "quizapp-dabad",
    storageBucket: "quizapp-dabad.appspot.com",
    messagingSenderId: "308840053318",
    appId: "1:308840053318:web:25496f482e0b5afef42847",
    measurementId: "G-9GL0LXNB0Z"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, collection, getDocs }; // Export the necessary functions
