import type { UserData } from '../types';
import { DEFAULT_GOALS, LEVEL_NAMES } from '../constants';

const USER_DATA_KEY = 'breakfreeplus_userdata';

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getInitialData = (): UserData => ({
  streak: 0,
  breakPoints: 0,
  lastLogin: new Date().toISOString(),
  completedGoals: [],
  habits: [],
  goals: DEFAULT_GOALS,
  level: 1,
  levelName: LEVEL_NAMES[0],
  consecutiveGoalDays: 0,
  journal: [],
});

const getUserData = (): UserData | null => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    
    let userData: UserData = JSON.parse(data);

    // Backwards compatibility for users
    if (!userData.habits) userData.habits = [];
    if (!userData.goals) userData.goals = DEFAULT_GOALS;
    if (userData.level === undefined) userData.level = 1;
    if (userData.levelName === undefined) userData.levelName = LEVEL_NAMES[userData.level - 1] || LEVEL_NAMES[0];
    if (userData.consecutiveGoalDays === undefined) userData.consecutiveGoalDays = 0;
    if (!userData.journal) userData.journal = [];


    const lastLoginDate = new Date(userData.lastLogin);
    const today = new Date();

    if (!isSameDay(lastLoginDate, today)) {
      // It's a new day
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      // Check app-wide login streak
      if (isSameDay(lastLoginDate, yesterday)) {
        userData.streak += 1;
      } else {
        userData.streak = 1; // Reset if not consecutive days
      }

      // Check consecutive goal completion days from yesterday
      const allGoalsCompletedYesterday = userData.goals.length > 0 && userData.goals.every(goal => userData.completedGoals.includes(goal.id));
      
      if (isSameDay(lastLoginDate, yesterday) && allGoalsCompletedYesterday) {
        userData.consecutiveGoalDays += 1;
      } else if (!isSameDay(lastLoginDate, yesterday)) {
        // if login streak was broken, goal streak is also broken
        userData.consecutiveGoalDays = 0;
      }

      // Reset daily goals and update login date
      userData.completedGoals = [];
      userData.lastLogin = today.toISOString();
      saveUserData(userData);
    }

    return userData;
  } catch (error) {
    console.error("Failed to parse user data from localStorage", error);
    return null;
  }
};

const saveUserData = (data: UserData): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
};

const login = (): UserData => {
  let data = getUserData();
  if (!data) {
    data = getInitialData();
    saveUserData(data);
  }
  return data;
}

const clearUserData = (): void => {
    localStorage.removeItem(USER_DATA_KEY);
};

const storageService = {
  getUserData,
  saveUserData,
  login,
  clearUserData,
};

export { storageService };