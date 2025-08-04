import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
    >
      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton; 