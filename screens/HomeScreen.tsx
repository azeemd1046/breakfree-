import React, { useMemo } from 'react';
import type { UserData, Screen } from '../types';
import { QUOTES } from '../constants';
import FocusIcon from '../components/icons/FocusIcon';
import ChatIcon from '../components/icons/ChatIcon';

interface HomeScreenProps {
  userData: UserData;
  navigateToScreen: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userData, navigateToScreen }) => {
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-600 text-lg">Your journey to freedom continues.</p>
      </header>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-500">Streak</p>
          <p className="text-5xl font-bold text-green-500">{userData.streak}</p>
          <p className="text-slate-500">Days</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-500">Break Points</p>
          <p className="text-5xl font-bold text-sky-500">{userData.breakPoints}</p>
          <p className="text-slate-500">Points</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">QUOTE OF THE DAY</h3>
        <p className="text-lg italic text-slate-800">"{dailyQuote.text}"</p>
        <p className="text-right text-slate-600 mt-2">- {dailyQuote.author}</p>
      </div>

      <div className="space-y-4">
         <button 
            onClick={() => navigateToScreen('chat')}
            className="w-full flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            <ChatIcon /> Talk to AI Companion
          </button>
        <button 
            onClick={() => navigateToScreen('focus')}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            <FocusIcon /> Start Focus Mode
          </button>
      </div>
    </div>
  );
};

export default HomeScreen;