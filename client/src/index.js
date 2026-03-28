import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

// Use Render backend in production, localhost in development
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://plspcoerepository1.onrender.com'
  : 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
