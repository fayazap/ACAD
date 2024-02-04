// frontend/src/components/CareerChatbot.js
import React, { useState } from 'react';

const CareerChatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [predictedCareer, setPredictedCareer] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = 'http://127.0.0.1:5000/predict_career';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPredictedCareer(data.predictedCareer);

      setError(null); // Clear any previous errors
    } catch (error) {
      setPredictedCareer('');
      setError(`Error: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Career</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_input">Enter your interests:</label>
        <input
          type="text"
          name="user_input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          required
        />
        <button type="submit">Predict Career</button>
      </form>
      {userInput && (
        <div>
          <p>You entered: {userInput}</p>
          {error ? (
            <p>Error predicting career: {error}</p>
          ) : (
            <p>Predicted career path: {predictedCareer}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerChatbot;
