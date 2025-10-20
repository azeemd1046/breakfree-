// FIX: Add QUOTES constant and import Quote type to resolve import errors.
import type { Goal, Quote } from './types';

export const DEFAULT_GOALS: Goal[] = [
    { id: 'pushups_10', text: 'Do 10 pushups', points: 10, category: 'Physical' },
    { id: 'read_5_pages', text: 'Read 5 pages of a book', points: 15, category: 'Mental' },
    { id: 'help_someone', text: 'Help someone today', points: 20, category: 'Emotional' },
    { id: 'go_outside_10', text: 'Go outside for 10 minutes', points: 10, category: 'Physical' },
    { id: 'journal_1_page', text: 'Write one journal entry', points: 15, category: 'Mental' },
    { id: 'no_doomscrolling', text: 'No doomscrolling for 1 hour before bed', points: 25, category: 'Digital Detox' },
];

export const GOAL_TEMPLATES: Goal[] = [
    { id: 'water_2l', text: 'Drink 2L water', points: 10, category: 'Physical' },
    { id: 'meditate_5m', text: 'Meditate for 5 minutes', points: 15, category: 'Mental' },
    { id: 'no_sugar', text: 'Avoid sugary snacks', points: 20, category: 'Physical' },
    { id: 'sleep_on_time', text: 'Sleep on time', points: 15, category: 'Physical' },
    { id: 'connect_friend', text: 'Connect with a friend', points: 15, category: 'Social' },
    { id: 'clean_space_5m', text: 'Tidy workspace for 5 mins', points: 10, category: 'Mental' },
];

export const INTENT_MESSAGES: string[] = [
    "Small wins build unshakable habits.",
    "Progress > Perfection.",
    "You don’t have to do it all. Just don’t stop.",
    "Discipline is today's work for tomorrow's freedom.",
    "Consistency is the weapon of the focused mind."
];

export const LEVEL_NAMES: string[] = [
    "Calm Apprentice", "Mind Warrior", "Free Soul", "Discipline Master", "Inner Citadel"
];


export const MOTIVATIONAL_MESSAGES: string[] = [
    "Discipline is freedom.",
    "The urge will pass. You stay.",
    "Small steps lead to great distances.",
    "You are in control.",
    "Reclaim your mind.",
];

export const QUOTES: Quote[] = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "The chains of habit are too weak to be felt until they are too strong to be broken.", author: "Samuel Johnson" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "If you want to have a life that is worth living, a life that expresses your deepest feelings and emotions and cares and dreams, you have to fight for it.", author: "Alice Walker" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "It is better to conquer yourself than to win a thousand battles.", author: "Buddha" },
    { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
    { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "To conquer oneself is a greater task than conquering others.", author: "Buddha" },
    { text: "The first and greatest victory is to conquer yourself.", author: "Plato" },
    { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
    { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
    { text: "We first make our habits, and then our habits make us.", author: "John Dryden" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Rohn" },
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { text: "It's not what we do once in a while that shapes our lives, but what we do consistently.", author: "Tony Robbins" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control.", author: "Epictetus" },
    { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
    { text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.", author: "Marcus Aurelius" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "An unexamined life is not worth living.", author: "Socrates" },
    { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "A man is but the product of his thoughts. What he thinks, he becomes.", author: "Mahatma Gandhi" },
    { text: "Control your own destiny or someone else will.", author: "Jack Welch" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
    { text: "He who is brave is free.", author: "Seneca" },
    { text: "No great thing is created suddenly.", author: "Epictetus" },
    { text: "Man conquers the world by conquering himself.", author: "Zeno of Citium" },
    { text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius" },
    { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
    { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "The only thing that's keeping you from getting what you want is the story you keep telling yourself.", author: "Tony Robbins" }
];