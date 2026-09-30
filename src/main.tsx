import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BugProvider } from './context/BugContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BugProvider>
      <App />
    </BugProvider>
  </React.StrictMode>
);
