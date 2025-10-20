import React, { useState, useEffect } from 'react';
import type { Screen, UserData } from './types';
import { storageService } from './services/storageService';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import FocusScreen from './screens/FocusScreen';
import GoalsScreen from './screens/GoalsScreen';
import HabitsScreen from './screens/HabitsScreen';
import WisdomScreen from './screens/WisdomScreen';
import DonateScreen from './screens/DonateScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

  useEffect(() => {
    const data = storageService.getUserData();
    if (data) {
      setUserData(data);
      setIsLoggedIn(true);
    }
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    const data = storageService.login();
    setUserData(data);
    setIsLoggedIn(true);
    setActiveScreen('home');
  };

  const handleLogout = () => {
    storageService.clearUserData();
    setIsLoggedIn(false);
    setUserData(null);
  };
  
  const updateUserData = (newUserData: Partial<UserData>) => {
    setUserData(prev => {
        if(!prev) return null;
        const updatedData = {...prev, ...newUserData};
        storageService.saveUserData(updatedData);
        return updatedData;
    });
  }
  
  const navigateToScreen = (screen: Screen, payload?: { prompt?: string }) => {
    if (screen === 'chat' && payload?.prompt) {
        setInitialChatPrompt(payload.prompt);
    } else {
        setInitialChatPrompt(null);
    }
    setActiveScreen(screen);
  };

  const renderScreen = () => {
    if (!userData) return null;

    switch (activeScreen) {
      case 'home':
        return <HomeScreen userData={userData} navigateToScreen={navigateToScreen} />;
      case 'chat':
        return <ChatScreen initialPrompt={initialChatPrompt} clearInitialPrompt={() => setInitialChatPrompt(null)} />;
      case 'focus':
        return <FocusScreen />;
      case 'goals':
        return <GoalsScreen userData={userData} updateUserData={updateUserData} />;
      case 'habits':
        return <HabitsScreen userData={userData} updateUserData={updateUserData} navigateToScreen={navigateToScreen} />;
      case 'wisdom':
        return <WisdomScreen userData={userData} updateUserData={updateUserData} />;
      case 'donate':
        return <DonateScreen />;
      case 'profile':
        return <ProfileScreen userData={userData} onLogout={handleLogout} />;
      default:
        return <HomeScreen userData={userData} navigateToScreen={navigateToScreen} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 text-slate-800">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">BreakFree+</h1>
        <p className="mt-4 text-lg italic text-slate-600">The urge will pass. You stay.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-slate-800 font-sans">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="pt-16 pb-20">
          <Header activeScreen={activeScreen} navigateToScreen={navigateToScreen} />
          <main className="p-4">{renderScreen()}</main>
          <BottomNav activeScreen={activeScreen} navigateToScreen={navigateToScreen} />
        </div>
      )}
    </div>
  );
};

export default App;