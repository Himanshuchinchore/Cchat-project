import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ change here
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root using React 18 API
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <App />
  </>
);

reportWebVitals();
