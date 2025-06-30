import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error("Google Client ID is not set. Please check your .env file.");
}

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ''}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();