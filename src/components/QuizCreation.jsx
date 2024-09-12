import React, { useState, useEffect } from 'react';
import './QuizCreation.css'; // Import the CSS

const QuizCreation = () => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');

  useEffect(() => {
    // Load questions from localStorage or use an empty array if none exist
    const savedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    setQuestions(savedQuestions);
  }, []);

  const handleAddQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        question: questionText,
        options: options,
        correct: correctOption
      }
    ];
    setQuestions(newQuestions);
    localStorage.setItem('questions', JSON.stringify(newQuestions)); // Save updated questions to localStorage

    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOption('');
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
          Add Question
        </button>
      </div>

      <ul className="questions-list">
        {questions.map((q, index) => (
          <li key={index} className="question-item">
            <strong>Q{index + 1}: </strong>{q.question}
            <ul className="option-list">
              {q.options.map((option, optIndex) => (
                <li key={optIndex} className={option === q.correct ? "correct-option" : ""}>
                  {option}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizCreation;
