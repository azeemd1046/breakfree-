import React, { useState, useEffect } from 'react';
import type { UserData, Goal } from '../types';
import { getAIMotivationForGoal } from '../services/geminiService';
import { GOAL_TEMPLATES, INTENT_MESSAGES } from '../constants';

interface GoalsScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

const GoalItem: React.FC<{
    goal: Goal;
    isCompleted: boolean;
    onComplete: (goalId: string, points: number) => void;
}> = ({ goal, isCompleted, onComplete }) => {
    return (
        <div className={`p-4 rounded-lg border flex items-center justify-between transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'}`}>
            <div>
                <p className={`font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{goal.text}</p>
                <p className="text-sm text-slate-500">{goal.points} points | {goal.category}</p>
            </div>
            <button
                onClick={() => onComplete(goal.id, goal.points)}
                disabled={isCompleted}
                className={`font-bold py-2 px-4 rounded-lg text-sm transition shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
                {isCompleted ? 'Done' : 'Complete'}
            </button>
        </div>
    );
};


const GoalsScreen: React.FC<GoalsScreenProps> = ({ userData, updateUserData }) => {
    const [motivation, setMotivation] = useState<string | null>(null);
    const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [currentIntentIndex, setCurrentIntentIndex] = useState(0);

    useEffect(() => {
        const intentTimer = setInterval(() => {
            setCurrentIntentIndex(prevIndex => (prevIndex + 1) % INTENT_MESSAGES.length);
        }, 7000); // Rotate every 7 seconds

        return () => clearInterval(intentTimer);
    }, []);

    const handleCompleteGoal = async (goalId: string, points: number) => {
        if (userData.completedGoals.includes(goalId)) return;

        const newCompletedGoals = [...userData.completedGoals, goalId];
        const newBreakPoints = userData.breakPoints + points;
        
        const goal = userData.goals.find(g => g.id === goalId);

        updateUserData({
            completedGoals: newCompletedGoals,
            breakPoints: newBreakPoints,
        });

        if (goal) {
            setIsLoadingMotivation(true);
            setMotivation('...'); // Show loading indicator
            const mot = await getAIMotivationForGoal(goal.text);
            setMotivation(mot);
            setIsLoadingMotivation(false);
        }
    };

    const handleAddGoal = (goal: Goal) => {
        if (userData.goals.some(g => g.id === goal.id)) return; // Avoid duplicates
        const newGoals = [...userData.goals, goal];
        updateUserData({ goals: newGoals });
    };

    const handleRemoveGoal = (goalId: string) => {
        const newGoals = userData.goals.filter(g => g.id !== goalId);
        const newCompletedGoals = userData.completedGoals.filter(id => id !== goalId);
        updateUserData({ goals: newGoals, completedGoals: newCompletedGoals });
    };

    const completedCount = userData.completedGoals.length;
    const totalCount = userData.goals.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const allGoalsCompleted = completedCount === totalCount && totalCount > 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Daily Goals</h1>
                <p className="text-slate-600">Complete your goals to earn points and build discipline.</p>
            </header>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                <p className="text-sm font-semibold text-sky-600 tracking-wider">DAILY INTENT</p>
                <p key={currentIntentIndex} className="text-slate-700 text-lg mt-1 animate-fade-in-fast">
                    {INTENT_MESSAGES[currentIntentIndex]}
                </p>
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">Daily Progress</span>
                    <span className="text-sm font-medium text-slate-700">{completedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {motivation && (
                <div className="bg-sky-100 border-l-4 border-sky-500 text-sky-800 p-4 rounded-r-lg relative animate-fade-in-fast" role="alert">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">AI Coach</p>
                            <p>{motivation}</p>
                        </div>
                        <button onClick={() => setMotivation(null)} className="text-sky-600 font-bold text-xl ml-2">&times;</button>
                    </div>
                </div>
            )}
            
            {allGoalsCompleted && !motivation && (
                 <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg" role="alert">
                    <p className="font-bold">All goals completed for today!</p>
                    <p>Incredible work. Rest and recharge for tomorrow.</p>
                </div>
            )}

            <div className="space-y-3">
                {userData.goals.length > 0 ? userData.goals.map(goal => (
                    <GoalItem 
                        key={goal.id} 
                        goal={goal}
                        isCompleted={userData.completedGoals.includes(goal.id)}
                        onComplete={handleCompleteGoal}
                    />
                )) : (
                     <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-600">No goals set for today.</p>
                        <p className="text-slate-500 text-sm mt-1">Click "Manage Goals" to add some.</p>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-200">
                <button onClick={() => setShowAddGoal(!showAddGoal)} className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg">
                    {showAddGoal ? 'Close' : 'Manage Goals'}
                </button>
            </div>

            {showAddGoal && (
                <div className="space-y-4 pt-4 animate-fade-in-fast">
                    <h2 className="text-xl font-bold text-slate-900">Add or Remove Goals</h2>
                    <div className="space-y-2">
                         <h3 className="text-lg font-semibold text-slate-800">Your Current Goals</h3>
                         {userData.goals.length > 0 ? userData.goals.map(g => (
                             <div key={g.id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                                 <span>{g.text}</span>
                                 <button onClick={() => handleRemoveGoal(g.id)} className="text-rose-500 hover:text-rose-700 text-sm font-bold">Remove</button>
                             </div>
                         )) : <p className="text-slate-500 text-sm">You haven't added any goals yet.</p>}
                    </div>
                     <div className="space-y-2">
                         <h3 className="text-lg font-semibold text-slate-800">Add from Templates</h3>
                         {GOAL_TEMPLATES.filter(template => !userData.goals.some(g => g.id === template.id)).map(template => (
                             <div key={template.id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                                 <span>{template.text}</span>
                                 <button onClick={() => handleAddGoal(template)} className="text-green-500 hover:text-green-700 text-sm font-bold">Add</button>
                             </div>
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsScreen;