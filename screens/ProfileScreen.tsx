import React from 'react';
import type { UserData } from '../types';
import LogoutIcon from '../components/icons/LogoutIcon';

interface ProfileScreenProps {
  userData: UserData;
  onLogout: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; colorClass: string; }> = ({ label, value, colorClass }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 text-sm">{label}</p>
        <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userData, onLogout }) => {
  const totalHabits = userData.habits.length;
  const totalGoals = userData.goals.length;
  const journalEntries = userData.journal.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sr-only">Profile</h1>
        <p className="text-2xl font-bold text-slate-800">{userData.levelName}</p>
        <p className="text-slate-600">Level {userData.level}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
          <StatCard label="Current Streak" value={userData.streak} colorClass="text-green-500" />
          <StatCard label="Break Points" value={userData.breakPoints} colorClass="text-sky-500" />
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Activity Summary</h2>
        <div className="space-y-2 text-slate-700">
            <div className="flex justify-between">
                <span>Habits Tracked:</span>
                <span className="font-bold">{totalHabits}</span>
            </div>
            <div className="flex justify-between">
                <span>Daily Goals:</span>
                <span className="font-bold">{totalGoals}</span>
            </div>
            <div className="flex justify-between">
                <span>Journal Entries:</span>
                <span className="font-bold">{journalEntries}</span>
            </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-200">
         <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300"
        >
            <LogoutIcon />
            Logout
        </button>
        <p className="mt-4 text-xs text-slate-500 text-center">
            Logging out will clear your data on this device if you are using anonymous login.
        </p>
      </div>

    </div>
  );
};

export default ProfileScreen;