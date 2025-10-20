import React, { useState, useEffect, useMemo } from 'react';
import type { UserData, Habit, Screen } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import FlameIcon from '../components/icons/FlameIcon';


interface HabitsScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToScreen: (screen: Screen, payload?: { prompt?: string }) => void;
}

const AddHabitForm: React.FC<{ 
    onAdd: (name: string, type: 'build' | 'break') => void; 
    onUpdate: (id: string, name: string, type: 'build' | 'break') => void;
    onCancel: () => void;
    habitToEdit?: Habit | null;
}> = ({ onAdd, onUpdate, onCancel, habitToEdit }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'build' | 'break'>('build');
    const isEditing = !!habitToEdit;

    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setType(habitToEdit.type);
        } else {
            setName('');
            setType('build');
        }
    }, [habitToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            if (isEditing && habitToEdit) {
                onUpdate(habitToEdit.id, name.trim(), type);
            } else {
                onAdd(name.trim(), type);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-slate-200 mb-6 animate-fade-in shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">{isEditing ? 'Edit Habit' : 'Add a New Habit'}</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read for 15 minutes"
                className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 rounded-lg p-3 mb-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Habit name"
            />
            <div className="flex gap-4 mb-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="habitType" value="build" checked={type === 'build'} onChange={() => setType('build')} className="form-radio h-4 w-4 text-green-500 bg-slate-100 border-slate-300 focus:ring-green-500" />
                    Build
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="habitType" value="break" checked={type === 'break'} onChange={() => setType('break')} className="form-radio h-4 w-4 text-rose-500 bg-slate-100 border-slate-300 focus:ring-rose-500" />
                    Break
                </label>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition duration-300 hover:bg-slate-300">Cancel</button>
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">{isEditing ? 'Save Changes' : 'Save Habit'}</button>
            </div>
        </form>
    );
};

const HabitWeekView: React.FC<{ completions: string[] }> = ({ completions }) => {
    const completionSet = useMemo(() => new Set(completions), [completions]);
    const todayStr = new Date().toISOString().split('T')[0];

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
    });

    return (
        <div className="flex justify-start gap-2 mt-2">
            {weekDays.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isCompleted = completionSet.has(dateStr);
                const isToday = dateStr === todayStr;

                return (
                    <div key={index} title={date.toLocaleDateString()}
                        className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-slate-200'} ${isToday ? 'ring-2 ring-slate-400' : ''}`}
                    ></div>
                );
            })}
        </div>
    );
};


const HabitItem: React.FC<{ habit: Habit; onComplete: (id: string) => void; onEdit: (habit: Habit) => void; onDelete: (id: string) => void; }> = ({ habit, onComplete, onEdit, onDelete }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completions.includes(todayStr);

    const calculateStreak = (completions: string[]): number => {
        if (completions.length === 0) return 0;
        
        const sortedDates = completions.map(c => {
            const [year, month, day] = c.split('-').map(Number);
            return new Date(year, month - 1, day);
        }).sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastCompletion = sortedDates[0];

        const diffTime = today.getTime() - lastCompletion.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) return 0;

        if (diffDays === 0 || diffDays === 1) {
            streak = 1;
            let currentDay = new Date(lastCompletion);
            for (let i = 1; i < sortedDates.length; i++) {
                const prevDay = new Date(currentDay);
                prevDay.setDate(prevDay.getDate() - 1);
                if (prevDay.getTime() === sortedDates[i].getTime()) {
                    streak++;
                    currentDay = sortedDates[i];
                } else {
                    break; 
                }
            }
        }
        
        if(!isCompletedToday && diffDays !== 0) {
             return streak;
        }

        if (isCompletedToday && streak === 0) return 1;

        return streak;
    };

    const streak = calculateStreak(habit.completions);
    
    let streakColorClass = 'text-slate-500';
    if (streak > 0) streakColorClass = 'text-orange-500';
    if (streak > 6) streakColorClass = 'text-red-600';


    return (
         <div className={`p-4 rounded-lg flex items-start justify-between transition-all duration-200 ${isCompletedToday ? `bg-slate-50 border-green-300` : 'bg-white border-slate-200'}`}>
            <div className="flex-grow mr-4">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">{habit.name}</p>
                    <button onClick={() => onEdit(habit)} className="text-slate-400 hover:text-slate-700 transition-colors" aria-label={`Edit ${habit.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                    </button>
                     <button onClick={() => onDelete(habit.id)} className="text-slate-400 hover:text-rose-500 transition-colors" aria-label={`Delete ${habit.name}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${streakColorClass}`}>
                    <FlameIcon />
                    <span>{streak > 0 ? `${streak} Day Streak` : 'No streak'}</span>
                </div>
                 <HabitWeekView completions={habit.completions} />
            </div>
            <button
              onClick={() => onComplete(habit.id)}
              disabled={isCompletedToday}
              className={`font-bold py-2 px-4 rounded-lg text-sm transition shrink-0 ${isCompletedToday ? 'bg-green-100 text-green-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              aria-label={isCompletedToday ? `Completed ${habit.name} today` : `Complete ${habit.name} for today`}
            >
              {isCompletedToday ? 'Done' : 'Complete'}
            </button>
        </div>
    );
};

const HabitProgressChart: React.FC<{ habits: Habit[] }> = ({ habits }) => {
    const chartData = useMemo(() => {
        const data = [];
        const today = new Date();
        const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            const dateStr = date.toISOString().split('T')[0];
            const dayName = dayFormatter.format(date);
            
            const completedCount = habits.reduce((count, habit) => {
                return habit.completions.includes(dateStr) ? count + 1 : count;
            }, 0);

            data.push({ name: dayName, completed: completedCount });
        }
        return data;
    }, [habits]);

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#334155' }}
                        itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


const HabitsScreen: React.FC<HabitsScreenProps> = ({ userData, updateUserData, navigateToScreen }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const handleAddHabit = (name: string, type: 'build' | 'break') => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            type,
            completions: [],
        };
        updateUserData({
            habits: [...userData.habits, newHabit]
        });
        setIsAdding(false);
    };

    const handleUpdateHabit = (id: string, name: string, type: 'build' | 'break') => {
        const updatedHabits = userData.habits.map(h => 
            h.id === id ? { ...h, name, type } : h
        );
        updateUserData({ habits: updatedHabits });
        setEditingHabit(null);
    };

    const handleDeleteHabit = (habitId: string) => {
        if (window.confirm("Are you sure you want to delete this habit? This cannot be undone.")) {
            const updatedHabits = userData.habits.filter(h => h.id !== habitId);
            updateUserData({ habits: updatedHabits });
        }
    };

    const handleStartEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingHabit(null);
    };

    const handleCompleteHabit = (habitId: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const updatedHabits = userData.habits.map(habit => {
            if (habit.id === habitId && !habit.completions.includes(todayStr)) {
                return { ...habit, completions: [...habit.completions, todayStr] };
            }
            return habit;
        });
        updateUserData({ habits: updatedHabits });
    };

    const handleGetSuggestions = () => {
        const existingHabits = userData.habits;
        let prompt: string;

        if (existingHabits.length > 0) {
            const habitList = existingHabits.map(h => `- ${h.name} (${h.type})`).join('\n');
            prompt = `I want to improve my life. Based on my current habits, can you suggest 3 new habits for me to either build or break? Here's what I'm already tracking:\n\n${habitList}\n\nPlease suggest habits that are small, actionable, and easy to start. Format your response as a simple bulleted list.`;
        } else {
            prompt = `I want to improve my life by building good habits and breaking bad ones. Can you suggest 3 new habits for me to start? Please suggest habits that are small, actionable, and easy to start. Format your response as a simple bulleted list.`;
        }
        
        navigateToScreen('chat', { prompt });
    };
  
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Habit Tracker</h1>
                    <p className="text-slate-600">Consistency is key.</p>
                </div>
                {!isAdding && !editingHabit && (
                     <button onClick={() => setIsAdding(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition duration-300 transform hover:scale-105">
                        New Habit
                    </button>
                )}
            </div>
            
            {(isAdding || editingHabit) && 
                <AddHabitForm 
                    onAdd={handleAddHabit} 
                    onUpdate={handleUpdateHabit} 
                    onCancel={handleCancel} 
                    habitToEdit={editingHabit} 
                />
            }
            
            <div className="space-y-3">
                {userData.habits.length > 0 ? (
                    userData.habits.map(habit => (
                        <HabitItem 
                            key={habit.id} 
                            habit={habit} 
                            onComplete={handleCompleteHabit} 
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteHabit}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-600">No habits yet.</p>
                        <p className="text-slate-500 text-sm mt-1">Click "New Habit" to start tracking.</p>
                    </div>
                )}
            </div>

            {userData.habits.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Weekly Progress</h2>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                         <HabitProgressChart habits={userData.habits} />
                    </div>
                </div>
            )}
            
            <div className="mt-8 text-center">
                <button
                    onClick={handleGetSuggestions}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
                    aria-label="Get AI suggestions for new habits"
                >
                    ✨ Get AI Suggestions
                </button>
            </div>
        </div>
    );
};

export default HabitsScreen;