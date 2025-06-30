import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '602455909378-gl04pqgpg68c559757rcvujdn9800iq8.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
        }
      );
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    const user = parseJwt(response.credential);
    console.log('🧠 Google JWT user:', user);
    login(user, response.credential);
    navigate('/dashboard');
  };

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-center p-10 rounded-lg shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          HealthBridge
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your AI-Powered Personal Health Record Assistant
        </p>
        <div id="googleSignInDiv" className="flex justify-center" />
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} HealthBridge. All Rights Reserved.
      </footer>
    </div>
  );
};

export default HomePage;
