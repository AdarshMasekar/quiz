import React, { useEffect, useState } from 'react';  
import { db, auth } from '../firebaseConfig'; // Import Firebase functions  
import { collection, getDocs, query, doc, getDoc, where, orderBy } from 'firebase/firestore'; // Import necessary Firebase functions  
import './LeaderBoard.css'; // Import the CSS  

const Leaderboard = () => {  
  const [users, setUsers] = useState([]);  
  const [isAdmin, setIsAdmin] = useState(false);  

  useEffect(() => {  
    const fetchUserData = async () => {  
      const user = auth.currentUser;  
      if (user) {  
        // Fetch all normal users (excluding admin)  
        const q = query(  
          collection(db, 'users'),  
          where('role', '!=', 'admin'), // Exclude admin  
          orderBy('highestScore', 'desc') // Order by highestScore  
        );  
        const querySnapshot = await getDocs(q);  
        const usersData = querySnapshot.docs.map((doc) => doc.data());  
        setUsers(usersData);  

        // Check user role from Firebase  
        const userRef = doc(db, 'users', user.email); // Assuming email is used as document ID  
        const userDoc = await getDoc(userRef);  
        const userData = userDoc.data();  
        setIsAdmin(userData?.role === 'admin');  
      }  
    };  

    fetchUserData();  
  }, []);  

  return (  
    <div className="leaderboard-container">  
      <h2 className="leaderboard-title">Leaderboard</h2>  
      <table className="leaderboard-table">  
        <thead>  
          <tr>  
            <th className="table-header">Username</th>  
            <th className="table-header">Email</th>  
            <th className="table-header">Highest Quiz Score</th>  
            <th className="table-header">Time Taken</th>  
            <th className="table-header">Rank</th>  
          </tr>  
        </thead>  
        <tbody>  
          {users.map((user, index) => (  
            <tr key={user.email} className="table-row">  
              <td className="table-cell">{user.username || 'N/A'}</td>  
              <td className="table-cell">{user.email}</td>  
              <td className="table-cell">{user.highestScore || 'N/A'}</td>  
              <td className="table-cell">  
                {user.timeTaken !== 0  
                  ? `${Math.floor(user.timeTaken / 60) > 0 ? `${Math.floor(user.timeTaken / 60)} minutes, ` : ''}${('0' + (user.timeTaken % 60)).slice(-2)} seconds`  
                  : `${user.timeTaken % 60} seconds`}  
              </td>  
              <td className="table-cell">{index + 1}</td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default Leaderboard; 