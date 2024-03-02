import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiHistory, setBmiHistory] = useState([]);

  useEffect(() => {
    loadBMIHistory();
  }, []);

  const calculateBMI = () => {
    if (!name || isNaN(height) || isNaN(weight)) {
      alert("Please enter valid data for Name, Height, and Weight.");
      return;
    }

    const bmiRecord = {
      name: name,
      height: parseFloat(height),
      weight: parseFloat(weight),
      bmi: 0 // This will be calculated on the server
    };

    fetch('http://localhost:8080/api/bmi/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bmiRecord)
    })
    .then(response => response.json())
    .then(data => {
      alert("BMI calculated successfully!");
      loadBMIHistory();
    })
    .catch(error => {
      console.error("Error calculating BMI:", error);
    });
  };

  const loadBMIHistory = () => {
    fetch('http://localhost:8080/api/bmi/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setBmiHistory(data);
    })
    .catch(error => {
      console.error("Error loading BMI history:", error);
    });
  };

  return (
    <div className="App">
      <h1>BMI Calculator</h1>

      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="height">Height (m):</label>
        <input type="number" step="0.01" id="height" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>

      <div>
        <label htmlFor="weight">Weight (kg):</label>
        <input type="number" step="0.01" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>

      <button onClick={calculateBMI}>Calculate BMI</button>

      <h2>BMI History</h2>
      <ul>
        {bmiHistory.map((record, index) => (
          <li key={index}>{record.name} - BMI: {record.bmi.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
