import React, { useState, useEffect, useMemo } from 'react';
import { QUOTES } from '../constants';

import MinusIcon from '../components/icons/MinusIcon';
import PlusIcon from '../components/icons/PlusIcon';
import PlayIcon from '../components/icons/PlayIcon';
import PauseIcon from '../components/icons/PauseIcon';

const MIN_DURATION = 5 * 60; // 5 minutes
const MAX_DURATION = 90 * 60; // 90 minutes
const DURATION_STEP = 5 * 60; // 5 minutes

const FocusScreen: React.FC = () => {
    const [duration, setDuration] = useState(25 * 60);
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [goal, setGoal] = useState('');

    const randomQuote = useMemo(() => {
        return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }, [sessionComplete]);

    // Effect for timer logic
    useEffect(() => {
        let intervalId: number | undefined;

        if (isTimerRunning && timeRemaining > 0) {
            intervalId = window.setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setSessionComplete(true);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isTimerRunning, timeRemaining]);
    
    // Effect to sync time remaining when duration changes
    useEffect(() => {
        setTimeRemaining(duration);
    }, [duration]);

    const adjustDuration = (amount: number) => {
        if(isTimerRunning) return;
        setDuration(prev => {
            const newDuration = prev + amount;
            if (newDuration >= MIN_DURATION && newDuration <= MAX_DURATION) {
                return newDuration;
            }
            return prev;
        });
    };

    const toggleTimer = () => {
        if (sessionComplete) {
            resetTimer();
        } else {
            setIsTimerRunning(!isTimerRunning);
        }
    };

    const resetTimer = () => {
        setIsTimerRunning(false);
        setSessionComplete(false);
        setTimeRemaining(duration);
    };
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    if (sessionComplete) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-11rem)] animate-fade-in">
                <h2 className="text-3xl font-bold text-green-500">Session Complete!</h2>
                {goal && <p className="text-xl mt-2 text-slate-700">You focused on: <span className="font-semibold">{goal}</span></p>}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 max-w-lg">
                    <p className="text-lg italic text-slate-800">"{randomQuote.text}"</p>
                    <p className="text-right text-slate-600 mt-2">- {randomQuote.author}</p>
                </div>
                <button
                    onClick={resetTimer}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                >
                    Start Another Session
                </button>
            </div>
        );
    }

    if (isTimerRunning) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-11rem)] animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 sr-only">Focus Mode</h2>
                {goal ? (
                     <p className="text-xl text-slate-600 max-w-md">Your intention: <span className="font-semibold text-slate-800">{goal}</span></p>
                ) : (
                    <p className="text-xl text-slate-600 max-w-md">Stay away from distractions. You can do this.</p>
                )}
                <div className="my-8 text-8xl font-black text-slate-900 tracking-tighter">
                    {formatTime(timeRemaining)}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className="bg-amber-400 hover:bg-amber-500 text-white font-bold p-4 rounded-full shadow-lg transition duration-300 flex items-center justify-center"
                        aria-label="Pause timer"
                    >
                        <PauseIcon />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-11rem)] animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 sr-only">Prepare to Focus</h1>
            
            <div className="my-6">
                <p className="text-slate-600 mb-2 font-medium">Set duration (minutes)</p>
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => adjustDuration(-DURATION_STEP)} disabled={duration <= MIN_DURATION} className="p-3 bg-slate-200 rounded-full disabled:opacity-50 hover:bg-slate-300 transition"><MinusIcon /></button>
                    <div className="text-7xl font-black text-slate-800 tracking-tighter w-40">
                        {formatTime(duration).split(':')[0]}
                    </div>
                     <button onClick={() => adjustDuration(DURATION_STEP)} disabled={duration >= MAX_DURATION} className="p-3 bg-slate-200 rounded-full disabled:opacity-50 hover:bg-slate-300 transition"><PlusIcon /></button>
                </div>
            </div>

            <div className="w-full max-w-sm mb-8">
                <label htmlFor="goal-input" className="text-slate-600 mb-2 font-medium block">What's your intention?</label>
                <input
                    id="goal-input"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Finish report draft"
                    className="w-full bg-white text-center text-slate-800 placeholder-slate-400 rounded-lg p-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            
            <button
                onClick={toggleTimer}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg text-xl transition duration-300 transform hover:scale-105 flex items-center gap-3"
            >
                <PlayIcon /> Start Focus
            </button>
        </div>
    );
};

export default FocusScreen;