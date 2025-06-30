import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    // Mock user data for demo purposes
    const mockUser = {
      name: 'Demo User',
      email: 'demo@healthbridge.com',
      picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    };
    
    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-center p-10 rounded-lg shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-md border border-gray-700 max-w-2xl mx-4">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          HealthBridge
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your AI-Powered Personal Health Record Assistant
        </p>
        <p className="text-gray-400 mb-8 text-sm">
          This is a demo version showcasing the frontend interface. 
          Upload medical documents and get AI-powered summaries to better understand your health records.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Demo Dashboard
          </button>
          
          <div className="text-gray-500 text-xs">
            * This is a frontend-only demo with mock data
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-4xl mx-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
          <div className="text-blue-400 text-2xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
          <p className="text-gray-400 text-sm">
            Upload medical documents and get clear, understandable summaries powered by advanced AI
          </p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
          <div className="text-teal-400 text-2xl mb-3">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-gray-400 text-sm">
            Your health information is encrypted and stored securely with industry-standard protection
          </p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-30 p-6 rounded-lg border border-gray-700">
          <div className="text-green-400 text-2xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-2">Easy to Understand</h3>
          <p className="text-gray-400 text-sm">
            Transform complex medical jargon into simple, actionable insights you can actually use
          </p>
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} HealthBridge. All Rights Reserved.
      </footer>
    </div>
  );
};

export default HomePage;