import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore
import './QuizCreation.css'; // Import the CSS

const QuizCreation = () => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const loadedQuestions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error.message);
      }
    };

    loadQuestions();
  }, []);

  const handleAddQuestion = async () => {
    try {
      const newQuestion = {
        question: questionText,
        options: options,
        correct: correctOption
      };

      if (editingQuestionId) {
        // Update existing question
        const questionRef = doc(db, 'questions', editingQuestionId);
        await updateDoc(questionRef, newQuestion);
        setQuestions(questions.map(q => (q.id === editingQuestionId ? { ...q, ...newQuestion } : q)));
        setEditingQuestionId(null);
      } else {
        // Add new question
        const docRef = await addDoc(collection(db, 'questions'), newQuestion);
        setQuestions([...questions, { id: docRef.id, ...newQuestion }]);
      }

      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOption('');
    } catch (error) {
      console.error('Error adding/updating question:', error.message);
    }
  };

  const handleEditQuestion = (id) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      setQuestionText(question.question);
      setOptions(question.options);
      setCorrectOption(question.correct);
      setEditingQuestionId(id);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error.message);
    }
  };

  return (
    <div className="quiz-creation-container">
      <h2 className="quiz-title">Create Quiz</h2>

      <div className="form-group">
        <input 
          type="text" 
          className="form-input" 
          placeholder="Enter question" 
          value={questionText} 
          onChange={(e) => setQuestionText(e.target.value)} 
        />

        {options.map((option, index) => (
          <input 
            key={index} 
            type="text" 
            className="form-input" 
            placeholder={`Option ${index + 1}`} 
            value={option} 
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }} 
          />
        ))}

        <select 
          className="form-select" 
          value={correctOption} 
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="">Select correct option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        <button className="add-button" onClick={handleAddQuestion}>
          {editingQuestionId ? 'Update Question' : 'Add Question'}
        </button>
      </div>

      <ul className="questions-list">
        {questions.map((q, index) => (
          <li key={index} className="question-item">
            <strong>Q{index + 1}: {q.question}</strong>
            <ul className="option-list">
              {q.options.map((option, optIndex) => (
                <li key={optIndex} className={option === q.correct ? "correct-option" : ""}>
                  {option}
                </li>
              ))}
            </ul>
            <div className="action-btn">
              <button className='edit-btn' onClick={() => handleEditQuestion(q.id)}>Edit</button>
              <button className='delete-btn' onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizCreation;
