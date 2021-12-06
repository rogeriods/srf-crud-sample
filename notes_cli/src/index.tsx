import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import './index.css';

axios.defaults.baseURL = 'http://localhost:8080/api/';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
