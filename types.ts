// FIX: The 'Screen' type is defined in this file, so importing it from './App' was incorrect and caused a circular dependency. The import statement has been removed.

export type Screen = 'home' | 'chat' | 'focus' | 'goals' | 'habits' | 'wisdom' | 'donate' | 'profile';

export interface Habit {
  id: string;
  name: string;
  type: 'build' | 'break';
  completions: string[]; // Array of 'YYYY-MM-DD' date strings
}

export type GoalCategory = 'Physical' | 'Mental' | 'Emotional' | 'Digital Detox' | 'Social';

export interface JournalEntry {
    date: string; // ISO string
    question: string;
    response: string;
    context?: string[]; // The wisdoms that prompted the question
}

export interface UserData {
  streak: number; // App-wide login streak
  breakPoints: number;
  lastLogin: string;
  completedGoals: string[]; 
  habits: Habit[];
  goals: Goal[]; // User's custom and default goals
  level: number;
  levelName: string;
  consecutiveGoalDays: number; // Days in a row all goals were completed
  journal: JournalEntry[];
}

export interface Goal {
  id: string;
  text: string;
  points: number;
  category: GoalCategory;
}

export interface Quote {
    text: string;
    author: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}