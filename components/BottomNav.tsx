import React from 'react';
import type { Screen } from '../types';
import HomeIcon from './icons/HomeIcon';
import ChatIcon from './icons/ChatIcon';
import FocusIcon from './icons/FocusIcon';
import GoalsIcon from './icons/GoalsIcon';
import HabitsIcon from './icons/HabitsIcon';
import WisdomIcon from './icons/WisdomIcon';
import DonateIcon from './icons/DonateIcon';

interface BottomNavProps {
  activeScreen: Screen;
  navigateToScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-green-500';
  const inactiveClasses = 'text-slate-500 hover:text-slate-800';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, navigateToScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-t border-slate-200 shadow-lg">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavItem
          label="Home"
          icon={<HomeIcon />}
          isActive={activeScreen === 'home'}
          onClick={() => navigateToScreen('home')}
        />
        <NavItem
          label="AI Chat"
          icon={<ChatIcon />}
          isActive={activeScreen === 'chat'}
          onClick={() => navigateToScreen('chat')}
        />
        <NavItem
          label="Focus"
          icon={<FocusIcon />}
          isActive={activeScreen === 'focus'}
          onClick={() => navigateToScreen('focus')}
        />
        <NavItem
          label="Goals"
          icon={<GoalsIcon />}
          isActive={activeScreen === 'goals'}
          onClick={() => navigateToScreen('goals')}
        />
        <NavItem
          label="Habits"
          icon={<HabitsIcon />}
          isActive={activeScreen === 'habits'}
          onClick={() => navigateToScreen('habits')}
        />
        <NavItem
          label="Wisdom"
          icon={<WisdomIcon />}
          isActive={activeScreen === 'wisdom'}
          onClick={() => navigateToScreen('wisdom')}
        />
        <NavItem
          label="Support"
          icon={<DonateIcon />}
          isActive={activeScreen === 'donate'}
          onClick={() => navigateToScreen('donate')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;