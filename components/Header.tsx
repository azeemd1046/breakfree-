import React from 'react';
import type { Screen } from '../types';
import UserIcon from './icons/UserIcon';

interface HeaderProps {
  activeScreen: Screen;
  navigateToScreen: (screen: Screen) => void;
}

const Header: React.FC<HeaderProps> = ({ activeScreen, navigateToScreen }) => {
  const screenTitles: Record<Screen, string> = {
    home: 'Home',
    chat: 'AI Companion',
    focus: 'Focus Mode',
    goals: 'Daily Goals',
    habits: 'Habit Tracker',
    wisdom: 'Wisdom',
    donate: 'Support',
    profile: 'Profile'
  };
  
  const title = screenTitles[activeScreen] || 'BreakFree+';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-10">
      <div className="flex justify-between items-center h-full max-w-lg mx-auto px-4">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <button 
          onClick={() => navigateToScreen('profile')} 
          className="text-slate-600 hover:text-green-500 transition-colors"
          aria-label="Open Profile"
        >
          <UserIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;