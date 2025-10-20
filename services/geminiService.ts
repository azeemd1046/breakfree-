import { GoogleGenAI, Chat } from "@google/genai";

const CHAT_SYSTEM_INSTRUCTION = `You are an empathetic, calm, and motivational AI companion for the BreakFree+ app. Your purpose is to help users quit harmful habits like porn, doomscrolling, and excessive phone use. Your tone should always be supportive and non-judgmental. If a user mentions relapse, boredom, or feeling urges, respond with empathy and understanding. Suggest concrete, positive real-world actions like doing pushups, reading a book, journaling, or taking a walk outside. Do not engage in any distracting or harmful topics. Occasionally, include a short, powerful motivational quote in your response. Your goal is to help the user regain focus, rebuild discipline, and live more purposefully. Keep your responses concise and helpful.`;

const WISDOM_SYSTEM_INSTRUCTION = `You are a calm and wise AI companion for the BreakFree+ app, helping users find clarity and motivation. A user will select a "Wisdom Stream" (a category). Your task is to provide a piece of wisdom related to that stream. Your response must be in Markdown and follow this structure exactly:
1.  **A relevant quote.** Format it as a blockquote (>).
2.  **A short reflection (2-3 sentences) explaining the quote's meaning in simple, encouraging words.** Start this section with "**Reflection:**".
3.  **A simple, actionable step (1 sentence) the user can take today.** Start this section with "**Actionable Step:**".
Do not include any other text, greetings, or explanations.`;

const GOAL_MOTIVATION_SYSTEM_INSTRUCTION = `You are a calm, concise, and encouraging AI companion for the BreakFree+ app. A user just completed a daily goal. Your task is to provide a short (1-2 sentence), powerful, and human-sounding motivational message related to their achievement. Do not use exclamation points or overly enthusiastic language. The tone should be one of quiet strength and validation. Focus on the underlying virtue being built, such as discipline, consistency, or self-care, rather than just the task itself.`;

const REFLECTION_PROMPT_SYSTEM_INSTRUCTION = `You are a thoughtful AI companion in the BreakFree+ app. The user has just read three pieces of wisdom. Your task is to ask a single, concise, and open-ended reflective question that connects the themes of the wisdom they've seen. For example, ask "Which of these ideas resonates most with your current challenges?" or "How might these concepts of discipline and patience apply to one specific goal you have this week?". The goal is to deepen their self-awareness. Do not greet the user or add any extra text. Just provide the question.`;


let chat: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAi = () => {
    if(!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}


const getChat = () => {
    if (!chat) {
        const aiInstance = getAi();
        chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: CHAT_SYSTEM_INSTRUCTION,
            },
        });
    }
    return chat;
};

export const getAIChatResponse = async (message: string): Promise<string> => {
    try {
        const chatInstance = getChat();
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting AI response:", error);
        return "I'm having a little trouble connecting right now. Let's take a deep breath. How about we try a simple activity? Maybe a few stretches or a short walk?";
    }
};

export const getAIMotivationForGoal = async (goalText: string): Promise<string> => {
    try {
        const aiInstance = getAi();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The user completed this goal: "${goalText}"`,
            config: {
                systemInstruction: GOAL_MOTIVATION_SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI motivation:", error);
        return "Well done. Each step forward matters."; // A graceful fallback
    }
}

export const getAIWisdom = async (topic: string): Promise<string> => {
    try {
        const aiInstance = getAi();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The chosen Wisdom Stream is: ${topic}`,
            config: {
                systemInstruction: WISDOM_SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI wisdom:", error);
        return "I'm unable to summon wisdom at this moment. Perhaps the quietest mind is the wisest. Try focusing on your breath for one minute.";
    }
}

export const getAIReflectionPrompt = async (wisdoms: string[]): Promise<string> => {
    try {
        const aiInstance = getAi();
        const wisdomContext = wisdoms.map((w, i) => `Wisdom ${i+1}:\n${w}`).join('\n\n');
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Here is the wisdom the user has seen:\n\n${wisdomContext}`,
            config: {
                systemInstruction: REFLECTION_PROMPT_SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI reflection prompt:", error);
        return "Which of the quotes you just read resonated the most with you today, and why?"; // A graceful fallback
    }
}