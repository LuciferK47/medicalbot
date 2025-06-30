import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-md border-b border-gray-700 p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          HealthBridge
        </Link>
        <div className="space-x-6 flex items-center">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;