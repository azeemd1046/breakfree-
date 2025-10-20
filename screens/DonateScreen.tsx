import React from 'react';
import DonateIcon from '../components/icons/DonateIcon';

const DonateScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto pt-10 animate-fade-in">
      <div className="text-green-500">
        <DonateIcon />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mt-4">Support BreakFree+</h1>
      <div className="mt-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-600 text-lg">
          This app is free forever.
        </p>
        <p className="mt-4 text-slate-600">
          We believe everyone deserves access to tools that can help them reclaim their focus and build a better life. BreakFree+ will never have ads, subscriptions, or paywalls for core features.
        </p>
        <p className="mt-4 text-slate-600">
          You can optionally donate to support development and help keep the app running for everyone. Your support is deeply appreciated.
        </p>
      </div>
       <button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            Donate (Coming Soon)
        </button>
    </div>
  );
};

export default DonateScreen;