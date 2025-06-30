import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await apiClient.post('/auth/google/callback', {
        token: credentialResponse.credential,
      });
      const { token, user } = res.data;
      login(user, token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
    }
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
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="filled_black"
            size="large"
            shape="pill"
          />
        </div>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} HealthBridge. All Rights Reserved.
      </footer>
    </div>
  );
};

export default HomePage;