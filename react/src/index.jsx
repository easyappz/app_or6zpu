import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { getSpec } from './api/openapi';

// Prime OpenAPI spec cache on app init (non-blocking)
getSpec().catch((e) => {
  // Surface to console, UI can read from getSpec() later if needed
  console.error('Failed to preload OpenAPI spec:', e);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
