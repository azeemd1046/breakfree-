import React from 'react';
import GoogleIcon from '../components/icons/GoogleIcon';
import EmailIcon from '../components/icons/EmailIcon';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // In a real application, you would integrate a Google Sign-In SDK here.
    // For example, using Firebase Authentication or the Google Identity Services library.
    // The flow would be:
    // 1. Trigger the Google Sign-In popup.
    // 2. Await the user's authentication and get an ID token.
    // 3. (Optional) Send this token to your backend to create a session or user record.
    // 4. On success, call the onLogin prop to proceed into the app.
    
    // For this simulation, we'll just call onLogin directly.
    onLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md w-full">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">BreakFree+</h1>
        <p className="mt-4 text-2xl text-slate-600">Reclaim your mind.</p>
        
        <div className="mt-12 space-y-4">
          <button 
            onClick={onLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Continue Anonymously
          </button>
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3 px-4 rounded-lg border border-slate-300 transition duration-300 hover:bg-slate-50 shadow-sm"
          >
            <GoogleIcon />
            Login with Google
          </button>
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3 px-4 rounded-lg border border-slate-300 transition duration-300 hover:bg-slate-50 shadow-sm"
          >
            <EmailIcon />
            Login with Email
          </button>
        </div>
        
        <p className="mt-8 text-xs text-slate-500">
          Your progress will be saved on this device. Your data is private, offline-first, and never shared.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;